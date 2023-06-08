import mongoose from 'mongoose';

import { RoleCreateAttrs, RoleInterface, RoleModel } from './role.interface';

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
            enum: {
                values: ['Owner', 'Admin', 'Teacher', 'User'],
                message: '{VALUE} is not a valid role',
            },
        },
        description: String,
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

schema.statics.build = (attrs: RoleCreateAttrs) => {
    return new Role(attrs);
};

export const Role = mongoose.model<RoleInterface, RoleModel>('Role', schema);
