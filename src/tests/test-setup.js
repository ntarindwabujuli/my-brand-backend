// test-setup.js
import seedDatabase from "./seed/index.js";
import mongoose from "mongoose";
// mongoose.set("useCreateIndex", true);
// mongoose.promise = global.Promise;

async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany();
    }
}

async function dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop();
        } catch (error) {
            // Sometimes this error happens, but you can safely ignore it
            if (error.message === "ns not found") return;
            // This error occurs when you use it.todo. You can
            // safely ignore this error too
            if (error.message.includes("a background operation is currently running"))
                return;
            console.log(error.message);
        }
    }
}

function setupDB(databaseName, runSaveMiddleware=false) {
    // Connect to Mongoose
    beforeAll(async () => {
        const url = `mongodb://127.0.0.1/${databaseName}`;
        await mongoose.connect(url, { useNewUrlParser: true });
    });
    // Seeds database before each test
    beforeEach(async () => {
        await seedDatabase(runSaveMiddleware)
    })

    // Cleans up database between each test
    afterEach(async () => {
        await removeAllCollections();
    });

    // Disconnect Mongoose
    afterAll(async () => {
        await dropAllCollections();
        await mongoose.connection.close();
    });
}

export default setupDB;