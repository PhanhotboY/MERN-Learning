import express from 'express';

import { userCtl } from './user.controller';
import { validateObjectId } from './user.middleware';
import { adminOnly, requireAuthentication } from '../middlewares/require-auth';
import { signinValidations, signupValidations } from './user.validation';

const userRouter = express.Router();

userRouter.post('/signout', userCtl.signout);
userRouter.post('/signup', signupValidations, userCtl.signup);
userRouter.post('/signin', signinValidations, userCtl.signin);

userRouter.patch('/:id', requireAuthentication, adminOnly, validateObjectId, userCtl.modifyUser);
userRouter.patch('/', requireAuthentication, userCtl.modifyField);

userRouter.delete('/:id', requireAuthentication, adminOnly, validateObjectId, userCtl.deleteUser);

userRouter.get('/current', requireAuthentication, userCtl.currentUser);
userRouter.get(
  '/details/:id',
  requireAuthentication,
  adminOnly,
  validateObjectId,
  userCtl.getUserDetail
);
userRouter.get('/:id', validateObjectId, userCtl.getUser);

userRouter.get('/', userCtl.getManyUser);

export { userRouter };
