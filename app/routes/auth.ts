import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

import UserSchema from '../models/User';
import AuthController from '../controllers/AuthController';
import { verifyRefreshToken, verifyToken } from '../middlewares/auth';
import envConfig from '../configs/env';
import { IGoogleData, IUserDecode } from '../types/auth';
import { signAccessToken, signRefreshToken } from '../configs/jwt';

passport.serializeUser((user, cb) => cb(null, user));

passport.deserializeUser((user, cb) => cb(null, user as Express.User));

passport.use(
  new GoogleStrategy(
    {
      clientID: envConfig.googleClientId,
      clientSecret: envConfig.googleClientSecret,
      callbackURL: '/api/v1/auth/google/callback',
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (_req, accessToken, refreshToken, profile, cb) => {
      try {
        const _user: IGoogleData = JSON.parse(profile._raw);

        const userExist = await UserSchema.findOne({ email: _user.email }).lean();

        // Case exist user email in database
        if (userExist) {
          const userToken: IUserDecode = {
            id: userExist._id.toHexString(),
            role: userExist.role,
          };

          const [accessToken, refreshToken] = await Promise.all([
            signAccessToken(userToken),
            signRefreshToken(userToken),
          ]);

          await UserSchema.findByIdAndUpdate(
            userExist._id,
            {
              $set: {
                refreshToken,
              },
            },
            {
              new: true,
            },
          );

          return cb(null, { ..._user, accessToken, refreshToken });
        }

        return cb(null, { ..._user });
      } catch (error) {
        return cb(null, profile);
      }
    },
  ),
);

const authRoutes = (router: Router) => {
  router.post('/auth/sign-up', AuthController.signUp);
  router.post('/auth/sign-in', AuthController.signIn);
  router.post('/auth/admin/sign-in', AuthController.signInAdmin);
  router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: `${envConfig.clientUrl}/`,
      failureRedirect: `${envConfig.clientUrl}/sign-in`,
    }),
  );
  router.get('/auth/google/success', AuthController.signInGoogleSucccess);
  router.get('/auth/get-me', verifyToken, AuthController.getMe);
  router.post('/auth/refresh-token', verifyRefreshToken, AuthController.refreshToken);
};

export default authRoutes;
