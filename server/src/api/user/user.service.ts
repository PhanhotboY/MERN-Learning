import mongoose from 'mongoose';

import { User } from './user.model';
import { Password } from '../services/password';
import { UserInterface } from './user.interface';
import { Role } from '../role/role.model';
import { BadRequestError } from '../errors/bad-request';

export const getUser = async ({
  id,
  email,
  isIncludePass,
  isDeleted,
}: {
  id?: string;
  email?: string;
  isIncludePass?: boolean;
  isDeleted?: boolean;
}) => {
  const unsetAttrs = [
    '_id',
    '__v',
    'roleId',
    'addressId',
    'stripeId',
    'role',
    'address._id',
    'address.__v',
  ];
  isIncludePass || unsetAttrs.push('password');

  const user = (
    await User.aggregate<UserInterface>([
      { $match: id ? { _id: new mongoose.Types.ObjectId(id) } : { email: email } },
      { $match: { deletedAt: { [isDeleted ? '$ne' : '$eq']: null } } },
      {
        $lookup: {
          from: 'addresses',
          as: 'address',
          localField: 'addressId',
          foreignField: '_id',
        },
      },
      {
        $lookup: {
          from: 'roles',
          as: 'role',
          localField: 'roleId',
          foreignField: '_id',
        },
      },
      {
        $addFields: {
          id: '$_id',
          address: { $arrayElemAt: ['$address', 0] },
          role: { $getField: { field: 'name', input: { $arrayElemAt: ['$role', 0] } } },
        },
      },
      {
        $addFields: {
          isAdmin: { $strcasecmp: ['$role', 'Admin'] },
          isOwner: { $strcasecmp: ['$role', 'Owner'] },
          isTeacher: { $strcasecmp: ['$role', 'Teacher'] },
        },
      },
      {
        $unset: unsetAttrs,
      },
    ])
  )[0];

  if (!user)
    throw new Error(
      `Get user service::: Cannot find the user with ${id ? `id: ${id}` : `email: ${email}`}`
    );

  user.isAdmin = !user.isAdmin;
  user.isOwner = !user.isOwner;
  user.isTeacher = !user.isTeacher;
  return user;
};

export const isEnoughPermission = (
  requestingUser: UserInterface,
  action: string,
  modifiedUser: UserInterface
) => {
  if (requestingUser.isOwner) return true;

  // if Not a teacher as well as an admin => user
  if (!requestingUser.isTeacher && !requestingUser.isAdmin) return false;

  switch (action) {
    // Admin can change anyone's role but the owner
    case 'changeRole':
      return !modifiedUser.isOwner;

    default:
      return false;
  }
};

export const getRoleId = async (name: 'Admin' | 'Owner' | 'Teacher' | 'User') => {
  const role = await Role.findOne({ name });

  if (!role) throw new BadRequestError({ type: 'role', message: `Role ${name} is not exist` });

  return role.id;
};

export const deleteUser = async ({
  id,
  isPermanently,
  isForce,
}: {
  id: string;
  isPermanently: boolean;
  isForce: boolean;
}) => {
  if (isForce) {
    const delResult = await User.findByIdAndDelete(id);
    return !!delResult;
  }

  const user = await getUser({ id, isDeleted: isPermanently });

  if (!user) return false;

  if (isPermanently) {
    const delResult = await User.findByIdAndDelete(id);
    return !!delResult;
  }

  const upResult = await User.findByIdAndUpdate(id, { $set: { deletedAt: Date.now() } });
  return !!upResult;
};

export const changePassword = async (
  user: UserInterface,
  currPassword: string,
  password: string
) => {
  const currentUser = await getUser({ id: user.id, isIncludePass: true });

  const cmpResult = await Password.compare(currentUser.password, currPassword);

  if (!cmpResult)
    throw new BadRequestError({ type: 'currPassword', message: 'Password not match' });

  if (await Password.compare(user.password, password))
    throw new BadRequestError({
      type: 'password',
      message: 'New password must be different from the old one',
    });

  const hashedPassword = await Password.toHash(password);

  return await User.findOneAndUpdate({ _id: user.id }, { password: hashedPassword });
};

export const serializeUser = (user: UserInterface) => {
  delete user.password;

  return user;
};
