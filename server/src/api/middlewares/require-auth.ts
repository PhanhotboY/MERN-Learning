import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { NotAuthorizedError } from '../errors/not-authorized';
import { UserInterface, UserJWTPayload } from '../user/user.interface';
import { getUser } from '../user/user.service';
import { ForbiddenError } from '../errors/forbidden';

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserInterface;
        }
    }
}

export const requireAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const jwtoken = req.session.jwt;

    if (!jwtoken) {
        throw new NotAuthorizedError('Not authorized');
    }

    const payload = jwt.verify(jwtoken, process.env.JWT_KEY) as UserJWTPayload;

    const currentUser = await getUser({ id: payload.id });

    req.currentUser = currentUser;

    next();
};

export const ownerOnly = (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser?.isOwner) throw new ForbiddenError('This page is for Owners only');

    next();
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.currentUser.isOwner) return next();

    if (!req.currentUser?.isAdmin)
        throw new ForbiddenError('This page is for Admins and Owners only');

    next();
};

export const teacherOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.currentUser.isOwner || req.currentUser.isAdmin) return next();

    if (!req.currentUser?.isTeacher)
        throw new ForbiddenError('This page is for Teachers, Admins and Owners only');

    next();
};
