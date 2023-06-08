import mongoose from 'mongoose';

export interface UserCreateAttrs {
    email: string;
    password: string;
    roleId: string;
    avatar?: string;
    stripeId?: string;
    addressId?: string;
    dayOfBirth?: Date;
    gender: string;
    lastName: string;
    firstName: string;
    phoneNumber: string;
}

export interface UserInterface extends mongoose.Document {
    id: string;
    email: string;
    password?: string;
    avatar?: string;
    dateOfBirth?: Date;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    lastLogin: Date;
    updatedAt: Date;
    createdAt: Date;
    isAdmin: boolean;
    isOwner: boolean;
    isTeacher: boolean;
}

export interface UserJWTPayload {
    id: string;
    email: string;
}

export interface UserModel extends mongoose.Model<UserInterface> {
    build(user: UserCreateAttrs): UserInterface;
}
