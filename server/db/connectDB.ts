// mongopassword=TufntZpdi2NQ7j3B
import mongoose from "mongoose";

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Mongo db Connected");
        
    } catch (error) {
        console.log("Error from MongoDB",error);
        
    }
};

export default connectDb;