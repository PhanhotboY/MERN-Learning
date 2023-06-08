import mongoose from 'mongoose';
import { SectionCreateAttrs, SectionInterface, SectionModel } from './section.interface';

const schema = new mongoose.Schema(
    {
        courseId: { type: mongoose.Types.ObjectId, require: true },
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

schema.statics.build = (section: SectionCreateAttrs) => {
    return new Section(section);
};

export const Section = mongoose.model<SectionInterface, SectionModel>('Section', schema);
