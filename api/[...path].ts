// Vercel serverless function for Express backend API routes
import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import app from '../packages/backend/src/app';

// Wrap Express app with serverless-http
const handler = serverless(app);

export default async function (req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
}
