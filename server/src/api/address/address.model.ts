import mongoose from 'mongoose';
import { AddressCreateAttrs, AddressInterface, AddressModel } from './address.interface';

const schema = new mongoose.Schema(
    {
        detail: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },

        updatedAt: { type: Date, required: true, default: Date.now() },
        createdAt: { type: Date, required: true, default: Date.now() },
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

schema.statics.build = (address: AddressCreateAttrs) => {
    return new Address(address);
};

export const Address = mongoose.model<AddressInterface, AddressModel>('Address', schema);
