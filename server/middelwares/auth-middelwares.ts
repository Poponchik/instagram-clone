import tokenService from '../service/token-service'
import { Request, Response, NextFunction } from 'express';
import { AuthUser } from '../types'


export default function (req: Request, res: Response, next: NextFunction) {
    try {
        const accessToken = req.headers.authorization
        
        if (!accessToken) {
            return next(res.status(403).json({ message: 'UNAUTHORIZED1' }))
        }

        const userData = tokenService.validateAccessToken(accessToken)
        
        if (!userData) {
            return next(res.status(403).json({ message: 'UNAUTHORIZED2' }))
        }

        req.user = (userData as AuthUser)
        next()
    } catch (e) {
        console.log(e)
        return next(res.status(500).json({ message: 'Something went wrong with token' }))
    }
}
