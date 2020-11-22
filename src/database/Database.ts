import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export default function initDB(): void {

    mongoose.Promise = Promise;
    const mongoServer = new MongoMemoryServer();

    mongoServer.getUri().then((mongoUri) => {
        const mongooseOpts = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        mongoose.connect(mongoUri, mongooseOpts);

        mongoose.connection.once('open', () => {
            console.log(`MongoDB successfully connected to ${mongoUri}`);
        });

        mongoose.connection.on('error', function (error) {
            console.log(`"MongoDB connection has occured ${error} error`);
        });

        mongoose.connection.on('disconnected', function(){
            console.log('Mongoose connection is disconnected');
        });

        process.on('SIGINT', function(){
            mongoose.connection.close(function(){
                console.log('Mongoose connection is disconnected due to application termination');
                process.exit(0)
            });
        });
    });
}