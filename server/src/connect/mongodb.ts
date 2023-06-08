import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    await mongoose
        .connect('mongodb://127.0.0.1:27017', {
            user: 'root',
            pass: 'phanhotboy',
            dbName: 'blourse',
            autoCreate: true,
        })
        .then(() => console.log('>>>>> Connection established successfully!'))
        .catch((err) => console.log('----- Fail to establish connection: ', err.message));
};

export const disconnectMongoDB = async () => {
    await mongoose
        .disconnect()
        .then(() => console.log('>>>>> Disconnect from MongoDB successfully'))
        .catch(() => console.log('----- Fail to disconnect from MongoDB'));
};
