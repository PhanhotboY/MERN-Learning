import mongoose from 'mongoose';
import { CourseCreateAttrs, CourseInterface, CourseModel } from './course.interface';

const schema = new mongoose.Schema(
    {
        fieldId: { type: mongoose.Types.ObjectId, required: true, ref: 'Field' },

        title: { type: String, required: true },
        price: { type: Number, required: true },
        overview: { type: String, require: true },
        customer: { type: String, require: true },
        thumbnail: { type: String, require: true },
        languages: { type: String, require: true },
        description: { type: String, require: true },
        requirement: { type: Array<String>, require: true },
        isPublic: { type: Boolean, require: true, default: true },

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

schema.statics.build = (course: CourseCreateAttrs) => {
    return new Course(course);
};

export const Course = mongoose.model<CourseInterface, CourseModel>('Course', schema);
