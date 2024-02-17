// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const ENVIRONMENT = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'sociabot2024',
  API_KEY_AI:
    process.env.API_KEY_AI || 'AIzaSyD-9tSrZ8J5JL3J3z5Z3J5J3J5J3J5J3J5',
  IA_MODEL: process.env.IA_MODEL || 'gemini-pro',
  MAX_OUTPUT_TOKENS: process.env.MAX_OUTPUT_TOKENS || 100,
};
