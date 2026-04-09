import { GoogleAuth } from 'google-auth-library';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId, isEvent } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const projectId = process.env.GOOGLE_PROJECT_ID || 'whatever-ceyu';
    const credentialsString = process.env.GOOGLE_CREDENTIALS_JSON || '{}';
    const credentials = JSON.parse(credentialsString);

    // Initialize Auth
    const auth = new GoogleAuth({
      credentials: Object.keys(credentials).length > 0 ? credentials : null,
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });
    
    // Fallback if credentials object is completely empty (useful for local if GOOGLE_APPLICATION_CREDENTIALS env var is somehow used)
    const client = await auth.getClient();
    const accessTokenObj = await client.getAccessToken();
    const accessToken = accessTokenObj.token || accessTokenObj; // Depending on versions, it might return string or object

    const dialogflowUrl = `https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent`;
    
    const requestBody = {
      queryInput: isEvent
        ? {
            event: {
              name: message,
              languageCode: 'en-US',
            },
          }
        : {
            text: {
              text: message,
              languageCode: 'en-US',
            },
          },
    };

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

    return res.status(200).json({
      response: responseText || 'I did not understand that. Can you rephrase?',
      intent: result.intent?.displayName,
    });
  } catch (error) {
    console.error('Dialogflow Error:', error);
    return res.status(500).json({
      error: 'Failed to process message',
      details: error.message,
    });
  }
}