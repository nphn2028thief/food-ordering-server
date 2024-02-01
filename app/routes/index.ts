import { Router } from 'express';

import authRoutes from './auth';

const router = Router();

const routes = () => {
  authRoutes(router);

  return router;
};

export default routes;
