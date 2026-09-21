import mongoose, { mongo } from "mongoose";

const ConnectionString = process.env.MONGODB_URI
const connectDB = async () => {
    try {
        await mongoose.connect(ConnectionString)
        console.log('connection successful')
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);

    }
}

export default connectDB