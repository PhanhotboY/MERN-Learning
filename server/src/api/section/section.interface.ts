import mongoose from 'mongoose';

export interface SectionCreateAttrs {
    courseId: string;
    title: string;
}

export interface SectionInterface extends mongoose.Document {
    id: string;
    courseId: string;
    title: string;
}

export interface SectionModel extends mongoose.Model<SectionInterface> {
    build(Section: SectionCreateAttrs): SectionInterface;
}
