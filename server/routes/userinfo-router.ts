import express from "express"
import UserInfoController from "../controllers/userinfo-controller"
import multer from 'multer'
import authmiddelware from '../middelwares/auth-middelwares'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatars')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' +file.originalname)
  }
})

const upload = multer({ storage: storage }).single('file')


const userInfoRouter = express.Router()


userInfoRouter.get('/:username', authmiddelware, UserInfoController.getUserInfo)
userInfoRouter.post('/edit', upload, authmiddelware,  UserInfoController.editUser)
userInfoRouter.post('/subscriptions', authmiddelware,  UserInfoController.subscribe)
userInfoRouter.post('/search', UserInfoController.findUser)


export default userInfoRouter