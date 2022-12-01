import express from "express"
import mongoose, { ConnectOptions } from "mongoose"
import authRouter from "./routes/auth-router"
import postRouter from "./routes/post-router"
import userInfoRouter from "./routes/userinfo-router"
import cors from 'cors'
import 'dotenv/config'

const PORT = process.env.PORT || 5000


let app = express()
app.use(express.json());
app.use(cors({
    credentials: true,                                 // разрешаем кукки
    origin: true                                      // URL нашего фронтенда
}))

app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/user', userInfoRouter)

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `*`);
    next();
})

app.use(express.static('./public'));



const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://liza:li153668@cluster0.1j7wx.mongodb.net/accounts', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions)
        app.listen(PORT, () => console.log(`Server working, PORT: ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()