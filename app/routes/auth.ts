import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { verifyRefreshToken, verifyToken } from '../middlewares/auth';

const authRoutes = (router: Router) => {
  router.post('/auth/sign-up', AuthController.signUp);
  router.post('/auth/sign-in', AuthController.signIn);
  router.post('/auth/admin/sign-in', AuthController.signInAdmin);
  router.get('/auth/get-me', verifyToken, AuthController.getMe);
  router.post('/auth/refresh-token', verifyRefreshToken, AuthController.refreshToken);
};

export default authRoutes;
