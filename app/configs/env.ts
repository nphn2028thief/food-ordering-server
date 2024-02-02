import dotenv from 'dotenv';

dotenv.config();

const clientUrl = process.env.NODE_ENV === 'development' ? process.env.DEV_CLIENT_URL : process.env.CLIENT_URL;

const envConfig = {
  port: process.env.PORT || '5000',
  databaseUrl: process.env.DATABASE_URL || '',
  accessTokenSecret: process.env.ACCESSTOKEN_SECRET || '123',
  refreshTokenSecret: process.env.REFRESHTOKEN_SECRET || '456',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  clientUrl,
};

export default envConfig;
