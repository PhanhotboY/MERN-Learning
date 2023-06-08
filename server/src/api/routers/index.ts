import express from 'express';

import { userRouter } from '../user/user.router';

const apiRouter = express.Router();

apiRouter.use('/users', userRouter);

export { apiRouter };
