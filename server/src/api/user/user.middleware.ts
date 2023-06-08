import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import { BadRequestError } from '../errors/bad-request';

export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ user: req.currentUser || null });
};

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const ObjectId = mongoose.Types.ObjectId;

  const isValid = ObjectId.isValid(id) && new ObjectId(id).toString() === id;

  if (!isValid) throw new BadRequestError({ type: 'id', message: 'User id must be valid' });

  next();
};
