import { NextFunction, Request, Response } from 'express';

import { User } from './user.model';
import { userAuth } from './user.auth';
import { ForbiddenError } from '../errors/forbidden';
import { BadRequestError } from '../errors/bad-request';
import { currentUser } from './user.middleware';
import * as userServ from './user.service';

export const userCtl = {
  signup: userAuth.signup,
  signin: userAuth.signin,
  signout: userAuth.signout,
  currentUser,

  async getUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const user = await User.findOne(
      { _id: id },
      { firstName: 1, lastName: 1, lastLogin: 1, gender: 1, avatar: 1 }
    );

    res.status(200).json({ user });
  },

  async getManyUser(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, gender } = req.query;

    const users = await User.find(
      {
        firstName: new RegExp(firstName as string, 'i'),
        lastName: new RegExp(lastName as string, 'i'),
        gender: new RegExp(`^${gender || '.*'}$`, 'i'),
      },
      { firstName: 1, lastName: 1, gender: 1, lastLogin: 1, avatar: 1 }
    );

    res.status(200).json({ users });
  },

  async getUserDetail(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { isDeleted } = req.query;

    const user = await userServ.getUser({ id, isDeleted: isDeleted === 'true' });

    res.status(200).json({ user });
  },

  async modifyUser(req: Request, res: Response, next: NextFunction) {
    const { action, currValue, value } = req.body;
    const { id: modifiedUserId } = req.params;

    const modifiedUser = await userServ.getUser({ id: modifiedUserId });

    if (!modifiedUser) throw new BadRequestError({ message: 'Modified user does not exist' });

    switch (action) {
      case 'changeRole':
        if (
          !userServ.isEnoughPermission(req.currentUser, action, modifiedUser) ||
          value === 'Owner'
        )
          throw new ForbiddenError('You are not authorized to do this');
        const roleId = await userServ.getRoleId(value);
        await User.findOneAndUpdate({ _id: modifiedUserId }, { roleId });
        return res.status(204).send({});

      default:
        return res.status(304).send();
    }
  },

  async modifyField(req: Request, res: Response, next: NextFunction) {
    const { action, currValue, value } = req.body;

    switch (action) {
      case 'changePassword':
        await userServ.changePassword(req.currentUser, currValue, value);
        return res.status(204).send();

      case 'changeInfo':

      default:
        return res.status(304).send();
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { isPermanently, isForce } = req.body;
    const { id } = req.params;

    const delResult = await userServ.deleteUser({
      id,
      isPermanently: isPermanently === 'true',
      isForce: isForce === 'true',
    });

    res.status(delResult ? 204 : 304).send({ delResult });
  },
};
