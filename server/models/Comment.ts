import mongoose from "mongoose"

const Comment = new mongoose.Schema({
    post: { type: mongoose.Types.ObjectId, ref: 'Posts', required: true},
    user: { type: mongoose.Types.ObjectId,  ref: 'User', required: true},
    text: { type: String, required: true }
})

export default mongoose.model('Comment', Comment)
