import mongoose from 'mongoose';

export interface CourseCreateAttrs {
    fieldId: string;

    isPublic?: boolean;

    title: string;
    price: number;
    overview: string;
    customer: string;
    languages: string;
    thumbnail: string;
    description: string;
    requirement: Array<string>;
}

export interface CourseInterface extends mongoose.Document {
    id: string;
    fieldId: string;

    title: string;
    price: number;
    overview: string;
    customer: string;
    isPublic: boolean;
    languages: string;
    thumbnail: string;
    description: string;
    requirement: Array<string>;

    updatedAt: Date;
    createdAt: Date;
}

export interface CourseModel extends mongoose.Model<CourseInterface> {
    build(course: CourseCreateAttrs): CourseInterface;
}
