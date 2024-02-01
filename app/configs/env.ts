import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
  port: process.env.PORT || '5000',
  databaseUrl: process.env.DATABASE_URL || '',
  accessTokenSecret: process.env.ACCESSTOKEN_SECRET || '123',
  refreshTokenSecret: process.env.REFRESHTOKEN_SECRET || '456',
};

export default envConfig;
