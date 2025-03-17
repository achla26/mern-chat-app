import mongoose from "mongoose"; 

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_CONNECT}`) 
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB Connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB