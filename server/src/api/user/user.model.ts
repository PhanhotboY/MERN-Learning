import mongoose from 'mongoose';

import { UserCreateAttrs, UserModel, UserInterface } from './user.interface';

const schema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        addressId: { type: mongoose.Types.ObjectId, ref: 'Address' },
        roleId: { type: mongoose.Types.ObjectId, required: true, ref: 'Role' },

        avatar: { type: String },
        dateOfBirth: { type: Date },
        lastLogin: { type: Date, default: Date.now() },

        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        stripeId: { type: String, unique: true, sparse: true, maxLength: 20 },
        gender: {
            type: String,
            required: true,
            enum: { values: ['Male', 'Female', 'Other'], message: '{VALUE} is not supported' },
        },

        deletedAt: { type: String },
        updatedAt: { type: Date, required: true, default: Date.now() },
        createdAt: { type: Date, required: true, default: Date.now() },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
                delete ret.stripeId;
                delete ret.roleId;
                delete ret.addressId;
                delete ret.deteledAt;
            },
        },
    }
);

schema.statics.build = (attrs: UserCreateAttrs) => {
    return new User(attrs);
};

export const User = mongoose.model<UserInterface, UserModel>('User', schema);
