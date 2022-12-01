import mongoose from "mongoose"

const LikePost = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId,  ref: 'User'},
    post: {type: mongoose.Types.ObjectId, ref: 'Posts', required: true}
})

export default mongoose.model('LikePost', LikePost)
