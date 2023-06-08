import mongoose from 'mongoose';

export interface AddressCreateAttrs {
    detail?: string;
    city: string;
    state: string;
    country: string;
}

export interface AddressInterface extends mongoose.Document {
    id: string;

    detail?: string;
    city: string;
    state: string;
    country: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface AddressModel extends mongoose.Model<AddressInterface> {
    build(address: AddressCreateAttrs): AddressInterface;
}
