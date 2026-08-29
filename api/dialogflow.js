import { GoogleAuth } from 'google-auth-library';
import { resolveOrigin, validateBody, rateLimit, clientKey } from './_guard.js';

export default async function handler(req, res) {
  // Only our own origins may call this — it spends the society's Dialogflow
  // quota against a service account, so '*' was effectively an open wallet.
  const origin = resolveOrigin(req.headers.origin);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(origin ? 200 : 403).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers.origin && !origin) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

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
