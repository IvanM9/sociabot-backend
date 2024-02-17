// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const ENVIRONMENT = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'sociabot2024',
  API_KEY_AI: process.env.API_KEY_AI || '',
  IA_MODEL: process.env.IA_MODEL || 'gemini-pro',
  MAX_OUTPUT_TOKENS: process.env.MAX_OUTPUT_TOKENS || 100,
};
