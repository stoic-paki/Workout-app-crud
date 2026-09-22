// import mongoose, { mongo } from "mongoose";

// const ConnectionString = process.env.MONGODB_URI
// const connectDB = async () => {
//     try {
//         await mongoose.connect(ConnectionString)
//         console.log('connection successful')
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);

//     }
// }

// export default connectDB

import mongoose from "mongoose";

const ConnectionString = process.env.MONGODB_URI;

let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    try {
        cachedConnection = await mongoose.connect(ConnectionString);
        console.log('connection successful');
        return cachedConnection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export default connectDB;