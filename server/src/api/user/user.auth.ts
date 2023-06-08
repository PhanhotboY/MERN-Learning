import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { User } from './user.model';
import { getUser, serializeUser } from './user.service';
import { Role } from '../role/role.model';
import { Password } from '../services/password';
import { Address } from '../address/address.model';
import { BadRequestError } from '../errors/bad-request';
import { ErrorResponseInterface } from '../errors/error.interface';
import { UserJWTPayload } from './user.interface';

export const userAuth = {
  async signup(req: Request, res: Response, next: NextFunction) {
    const {
      email,
      password,
      phoneNumber,
      firstName,
      lastName,
      gender,
      country,
      state,
      city,
      detail,
    } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError({ type: 'email', message: 'Email is already registered' });
    }

    const hashedPassword = await Password.toHash(password);
    const { id: roleId } = await Role.findOne({ name: 'User' });
    const { id: addressId } = await Address.build({
      detail: detail,
      city: city,
      state: state,
      country: country,
    }).save();

    const user = User.build({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      gender,
      roleId,
      addressId,
    });

    await user.save();

    const jwtoken = jwt.sign(
      { email: user.email, id: user.id } as UserJWTPayload,
      process.env.JWT_KEY
    );

    req.session = {
      jwt: jwtoken,
    };

    const respUser = await getUser({ id: user.id });

    res.status(201).json({ user: respUser });
  },

  async signin(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!(await User.findOne({ email }))) {
      throw new BadRequestError({ type: 'email', message: 'Email is not registered' });
    }

    const existingUser = await getUser({ email, isIncludePass: true });

    const cmpResult = await Password.compare(existingUser.password, password);

    if (!cmpResult) {
      throw new BadRequestError({ type: 'password', message: 'Password not match' });
    }

    const user = serializeUser(existingUser);

    const jwtoken = jwt.sign(
      { id: user.id, email: user.email } as UserJWTPayload,
      process.env.JWT_KEY
    );

    req.session = { jwt: jwtoken };
    return res.status(200).json({ user });
  },

  signout(req: Request, res: Response, next: NextFunction) {
    delete req.session.jwt;

    res.status(200).send({ message: 'Signout successfully' });
  },
};
