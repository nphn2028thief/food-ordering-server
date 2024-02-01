import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createHttpError from 'http-errors';
import passport from 'passport';

import connectToDB from './configs/database';
import envConfig from './configs/env';

const app = express();

app.use(express.json({ limit: '100mb', type: 'application/json' }));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
app.use(morgan('tiny'));

app.use(express.urlencoded({ extended: true }));

app.use(express.static('uploads'));

connectToDB();

app.use((_, res, next) => {
  res.status(404);
  next(createHttpError[404]('This route does not exist!'));
});

app.use((err: createHttpError.HttpError, _req: Request, res: Response, _next: NextFunction) => {
  return res.json({
    status: err.status,
    message: err.message,
  });
});

app.listen(envConfig.port, () => {
  console.log(`Server app listening on port ${process.env.PORT}`);
});
