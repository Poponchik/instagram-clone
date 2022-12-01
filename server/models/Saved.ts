import mongoose from "mongoose"

const Saved = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId,  ref: 'User', required: true},
    post: { type: mongoose.Types.ObjectId, ref: 'Post', required: true}
})

export default mongoose.model('Saved', Saved)
