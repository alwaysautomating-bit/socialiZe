import {
  generateTranslation,
  getMissingConfigError,
  mapTranslateError,
  parseTranslatePayload,
} from '../../shared/translate.js';

export const handler = async (event: { httpMethod: string; body: string | null }) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing request body' }),
    };
  }

  let payload: ReturnType<typeof parseTranslatePayload>;
  try {
    payload = parseTranslatePayload(JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  if (!payload) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields: text, platform, tone' }),
    };
  }

  const configError = getMissingConfigError();
  if (configError) {
    return {
      statusCode: configError.status,
      body: JSON.stringify(configError.body),
    };
  }

  try {
    const result = await generateTranslation(payload);
    return {
      statusCode: result.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.body),
    };
  } catch (err) {
    const error = mapTranslateError(err);
    return { statusCode: error.status, body: JSON.stringify(error.body) };
  }
};
