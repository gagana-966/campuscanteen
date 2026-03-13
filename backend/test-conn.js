import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("SUCCESS");
        process.exit(0);
    })
    .catch(err => {
        console.log("ERROR:", err.message);
        process.exit(1);
    });
