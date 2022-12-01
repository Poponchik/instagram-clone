import * as jwt from 'jsonwebtoken'

class TokenServise {
    generateAccessToken(id: string, email: string, username: string, photo: string) {
        const payload = {
            id,
            email,
            username,
            photo
        }
        const accessToken = jwt.sign(payload, (process.env.JWT_ACCESS_SECRET as string), { expiresIn: '1d' })
        return {
            accessToken
        }
    }

    validateAccessToken(token: string) {        
        try {
            const userData = jwt.verify(token,(process.env.JWT_ACCESS_SECRET as string))
            
            return userData
        } catch (e) {
            return null
        }
    }
}

export default new TokenServise