import mongoose from 'mongoose';

export interface FieldCreateAttrs {
    title: string;
}

export interface FieldInterface extends mongoose.Document {
    id: string;
    title: string;
}

export interface FieldModel extends mongoose.Model<FieldInterface> {
    build(field: FieldCreateAttrs): FieldInterface;
}
