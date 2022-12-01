import mongoose from "mongoose"


const Subscriptions = new mongoose.Schema({
    subscriber:  {type: mongoose.Types.ObjectId, required: true},
    subscribed:  {type: mongoose.Types.ObjectId, required: true}
})

export default mongoose.model('Subscription', Subscriptions)
