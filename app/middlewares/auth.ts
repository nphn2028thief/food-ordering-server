import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';

import handleResponse from '../configs/response';
import envConfig from '../configs/env';
import { TOKEN_EXPIRED_NAME } from '../constants/enum';
import { handleCheckUserId } from '../utils';
import { IJwtPayload } from '../types/auth';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next(handleResponse.forbidden(res, 'Access denied!'));
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    next(handleResponse.forbidden(res, 'Access denied!'));
    return;
  }

  Jwt.verify(token, envConfig.accessTokenSecret, (err, payload) => {
    if (err) {
      if (err.name === TOKEN_EXPIRED_NAME) {
        next(handleResponse.timeout(res));
        return;
      }

      // Other Jwt error
      next(
        res.send({
          name: err.name,
          message: err.message,
        }),
      );
      return;
    }

    const { user } = payload as IJwtPayload;

    if (!handleCheckUserId(user.id)) {
      next(handleResponse.unauthorized(res, 'User is not valid!'));
      return;
    }

    req.userDecode = user;
    next();
  });
};

export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body as { refreshToken: string };

  if (!refreshToken) {
    next(handleResponse.badRequest(res, 'Refresh token is required!'));
    return;
  }

  Jwt.verify(refreshToken, envConfig.refreshTokenSecret, (err, payload) => {
    if (err) {
      if (err.name === TOKEN_EXPIRED_NAME) {
        next(handleResponse.timeout(res));
        return;
      }

      // Other Jwt error
      next(
        res.send({
          name: err.name,
          message: err.message,
        }),
      );
      return;
    }

    const { user } = payload as IJwtPayload;

    if (!handleCheckUserId(user.id)) {
      next(handleResponse.unauthorized(res));
      return;
    }

    req.userDecode = user;
    next();
  });
};
