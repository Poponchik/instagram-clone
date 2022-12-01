import mongoose from "mongoose"
import { Post } from "../types"

const Post = new mongoose.Schema({
    created: {type: Date, required: true},
    photo: { type: String },
    user: { type: mongoose.Types.ObjectId,  ref: 'User'},
    description: { type: String }
})

export default mongoose.model<Post>('Post', Post)
