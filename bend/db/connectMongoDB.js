import mongoose from "mongoose";
import mongose, { mongo } from "mongoose";

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`ERROR: connecting to mongoDB = ${error.message}`);
        process.exit(1);
    }
}


export default connectMongoDB;