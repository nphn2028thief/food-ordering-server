import JWT from 'jsonwebtoken';

import envConfig from './env';
import { IUserDecode } from '../types/auth';

export const signAccessToken = async (user: IUserDecode) => {
  return new Promise((resolve, reject) => {
    const payload: JWT.JwtPayload = {
      user,
    };

    const options: JWT.SignOptions = {
      expiresIn: '2h',
    };

    JWT.sign(payload, envConfig.accessTokenSecret, options, (err, tokens) => (err ? reject(err) : resolve(tokens)));
  });
};

export const signRefreshToken = async (user: IUserDecode) => {
  return new Promise((resolve, reject) => {
    const payload: JWT.JwtPayload = {
      user,
    };

    const options: JWT.SignOptions = {
      expiresIn: '30d',
    };

    JWT.sign(payload, envConfig.refreshTokenSecret, options, (err, tokens) => (err ? reject(err) : resolve(tokens)));
  });
};
