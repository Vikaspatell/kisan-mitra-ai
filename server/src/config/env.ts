import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or server
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback to current dir

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/kisan_mitra',
  jwtSecret: process.env.JWT_SECRET || 'kisan_mitra_default_secret_key_2026',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  dataGovInApiKey: process.env.DATA_GOV_IN_API_KEY || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
