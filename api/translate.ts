import {
  generateTranslation,
  getMissingConfigError,
  mapTranslateError,
  parseTranslatePayload,
} from '../shared/translate.js';

type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

function sendJson(res: VercelResponse, status: number, body: unknown) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.json(body);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const payload = parseTranslatePayload(req.body ?? {});
  if (!payload) {
    sendJson(res, 400, { error: 'Missing required fields: text, platform, tone' });
    return;
  }

  const configError = getMissingConfigError();
  if (configError) {
    sendJson(res, configError.status, configError.body);
    return;
  }

  try {
    const result = await generateTranslation(payload);
    sendJson(res, result.status, result.body);
  } catch (err) {
    const error = mapTranslateError(err);
    sendJson(res, error.status, error.body);
  }
}
