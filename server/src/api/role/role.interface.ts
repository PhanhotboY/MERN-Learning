import mongoose from 'mongoose';

export interface RoleCreateAttrs {
    name: string;
    description: string;
}

export interface RoleInterface extends mongoose.Document {
    id: string;

    name: string;
    description: string;
}

export interface RoleModel extends mongoose.Model<RoleInterface> {
    build(role: RoleCreateAttrs): RoleInterface;
}
