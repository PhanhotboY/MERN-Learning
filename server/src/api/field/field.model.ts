import mongoose from 'mongoose';
import { FieldCreateAttrs, FieldInterface, FieldModel } from './field.interface';

const schema = new mongoose.Schema(
    {
        title: { type: String, required: true },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._it;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

schema.statics.build = (field: FieldCreateAttrs) => {
    return new Field(field);
};

export const Field = mongoose.model<FieldInterface, FieldModel>('Field', schema);
