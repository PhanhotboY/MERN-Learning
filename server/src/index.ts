import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import cookieSession from 'cookie-session';
import { json, urlencoded } from 'body-parser';
import 'express-async-errors';
require('dotenv').config();

import { connectMongoDB, disconnectMongoDB } from './connect/mongodb';
import { apiRouter } from './api/routers';
import { NotFoundError } from './api/errors/not-found';
import { errorHandler } from './api/middlewares/error-handler';

const app = express();
app.use(helmet());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(
  cookieSession({
    secure: false,
    signed: false,
    maxAge: 1000 * 60 * 60 * 24,
  })
);
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  })
);

if (!process.env.JWT_KEY) throw new Error('JWT key must be defined');

app.use('/api', apiRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const PORT = process.env.NODE_PORT || 8080;

app.listen(PORT, async () => {
  await connectMongoDB();

  console.log('hello world from port ' + PORT);
});

process.on('exit', async () => {
  await disconnectMongoDB();
});

process.on('SIGTERM', async () => {
  await disconnectMongoDB();
});

process.on('SIGINT', async () => {
  await disconnectMongoDB();
});

process.on('uncaughtException', async () => {
  await disconnectMongoDB();
});
