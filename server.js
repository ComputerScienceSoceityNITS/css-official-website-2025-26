import express from 'express';
import cors from 'cors';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ALLOWED_ORIGINS, validateBody, rateLimit, clientKey } from './api/_guard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Same origin allowlist as the serverless proxy — an open CORS policy on an
// endpoint backed by a service account lets anyone spend our Dialogflow quota.
app.use(
  cors({
    origin(origin, cb) {
      // allow same-origin / curl / server-to-server (no Origin header)
      if (!origin) return cb(null, true);
      return cb(null, ALLOWED_ORIGINS.includes(origin));
    },
    methods: ['POST', 'OPTIONS'],
  })
);
// Cap the body so a large payload cannot be used to exhaust memory.
app.use(express.json({ limit: '32kb' }));

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});


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
  const limit = rateLimit(clientKey(req));
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfter));
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const checked = validateBody(req.body);
    if (!checked.ok) {
      return res.status(400).json({ error: checked.error });
    }
    const { message, sessionId, isEvent } = checked.value;

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
