import mongoose, { Schema } from "mongoose";
import { User } from "../types";

const User: Schema = new Schema({
    name: {type: String, required: true},
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    description: {type: String},
    photo: {
        type: String, 
        default: 'avatars/default.jpg'
    }
})



export default mongoose.model<User>("User", User);