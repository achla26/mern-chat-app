import mongoose from "mongoose"; 

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_CONNECT}`) 
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB Connection FAILED ", error.message);
        process.exit(1)  // 1 is failure, 0 status code is success
    }
}

export default connectDB;