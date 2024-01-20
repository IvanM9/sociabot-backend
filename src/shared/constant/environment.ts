// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const ENVIRONMENT = {
  IA_API_URL: process.env.IA_API_URL || 'http://localhost:5000/api/v1/ia',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'sociabot2024',
};
