import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export default function initDB(): void {
    mongoose.Promise = Promise;
    if (process.env.MONGO_URI) {
        console.log("connect to mongo URI from env");
        connectMongo(process.env.MONGO_URI);
    } else {
        console.log("create inMemMongo");
        const mongoInMemServer = new MongoMemoryServer();
        mongoInMemServer.getUri().then((mongoUri) => connectMongo(mongoUri));
    }
}

function connectMongo(mongoUri: string) {
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    };
    
    mongoose.connect(mongoUri, mongooseOpts);

    mongoose.connection.once('open', () => {
        console.log(`MongoDB successfully connected to ${mongoUri}`);
    });

    mongoose.connection.on('error', function (error) {
        console.log(`"MongoDB connection has occured ${error} error`);
    });

    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose connection is disconnected');
    });

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose connection is disconnected due to application termination');
            process.exit(0)
        });
    });
}