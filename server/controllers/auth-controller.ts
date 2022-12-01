import { Request, Response } from 'express';
import User from '../models/User'
import { validationResult } from 'express-validator'
import * as bcrypt from 'bcrypt'
import tokenService from '../service/token-service'
import {Post as PostType, Comment as CommentType, User as UserType} from '../types'


class AuthController {
    async registration(req: Request, res: Response) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Ошибка при регистрации', errors })
            }

            const { name, username, email, password } = req.body

            const candidate: UserType | null = await User.findOne({ email })

            if (candidate) {
                return res.status(400).json({ message: `Пользователь с email: ${email} уже существует` })
            }

            const hashPassword = bcrypt.hashSync(password, 7)
            await new User({ email, name, username, password: hashPassword}).save()
            return res.json({message: 'Пользователь зарегестрирован'})

        } catch (e) {
            res.status(400).json({ message: `Registration error - ${e}` })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const user: UserType = (await User.findOne({ email }))!
            if (!user) {
                return res.status(400).json({ message: `Пользоватеть с email ${email} не найден` })
            }
            const validPassword = bcrypt.compare(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: 'Введен не верный пароль' })

            }

            const token = tokenService.generateAccessToken(user._id, user.email, user.username, user.photo)
            return res.json(token)

        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
        
    }

}

export default new AuthController()

