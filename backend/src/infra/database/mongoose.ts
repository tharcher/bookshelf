import mongoose from "mongoose";
import { HttpException } from "../../interfaces/HttpException";

export async function connect() {
    try {
        if(!process.env.DATABASE_URL) throw new HttpException(500, 'Missing DATABASE_URL');
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database Connected");        
    } catch (error: any) {
        throw new HttpException(500, error.message);
    }
} 