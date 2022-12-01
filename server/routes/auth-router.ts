import * as express from "express"
import authController from "../controllers/auth-controller"
import { body } from 'express-validator'


const authRouter = express.Router()

authRouter.post('/registration',
    body('name').isLength({min:2, max: 12}),
    body('username').isLength({min: 5, max: 20}),
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 20}),
    authController.registration)

authRouter.post('/login', authController.login)

export default authRouter
