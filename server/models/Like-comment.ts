import mongoose from "mongoose"

const LikeComment = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId,  ref: 'User'},
    comment: {type: mongoose.Types.ObjectId, ref: 'Comments', required: true}
})

export default mongoose.model('LikeComment', LikeComment)