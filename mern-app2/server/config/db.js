import mongoose from 'mongoose';

export const connectdb=async()=>{
 try {
    const db=await mongoose.connect(process.env.MONGODB_URI)
    if (db) {
          console.log("Database connected: " + db.connection.host)
        } else {
            console.log("Err: Database isn't connected");
    }
 } catch (error) {
    console.log("something went wrong",error);
    
 }
}

