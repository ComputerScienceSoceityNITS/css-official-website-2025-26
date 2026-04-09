import express from 'express';
import cors from 'cors';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const credentials = process.env.GOOGLE_CREDENTIALS_JSON 
  ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
  : undefined;

const auth = new GoogleAuth(
  credentials 
    ? { credentials: Object.keys(credentials).length > 0 ? credentials : null, scopes: 'https://www.googleapis.com/auth/cloud-platform' } 
    : { keyFilename: join(__dirname, 'whatever-ceyu-b622005692d5.json'), scopes: 'https://www.googleapis.com/auth/cloud-platform' }
);

const projectId = process.env.GOOGLE_PROJECT_ID || 'whatever-ceyu';

app.post('/api/dialogflow', async (req, res) => {
  try {
    const { message, sessionId, isEvent } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const client = await auth.getClient();
    const accessTokenObj = await client.getAccessToken();
    const accessToken = accessTokenObj.token || accessTokenObj;

    const dialogflowUrl = `https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent`;

    let requestBody;

    if (isEvent) {
      requestBody = {
        queryInput: {
          event: {
            name: message,
            languageCode: 'en-US',
          },
        },
      };
    } else {
      requestBody = {
        queryInput: {
          text: {
            text: message,
            languageCode: 'en-US',
          },
        },
      };
    }

    const response = await fetch(dialogflowUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dialogflow REST API Error:', response.status, errorText);
      throw new Error(`Dialogflow API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const result = data.queryResult;

    let responseText = result.fulfillmentText;

    if (result.fulfillmentMessages && result.fulfillmentMessages.length > 0) {
      const textMessages = result.fulfillmentMessages
        .filter((msg) => msg.text && msg.text.text)
        .map((msg) => msg.text.text[0]);

      if (textMessages.length > 0) {
        responseText = textMessages.join('\n');
      }
    }

    res.json({
      response: responseText || 'I did not understand that. Can you rephrase?',
      intent: result.intent?.displayName,
    });
  } catch (error) {
    console.error('Dialogflow Error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Dialogflow server running on http://localhost:${port}`);
});