import  express from 'express'
import PostController from "../controllers/post-controller"
import multer from 'multer'
import authMiddelware from '../middelwares/auth-middelwares'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/posts')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage }).single('photo')

const postRouter = express.Router()

postRouter.post('/upload', upload, authMiddelware, PostController.createPost)
postRouter.get('/feed/get',authMiddelware, PostController.getFeed)
postRouter.get('/saved/get',authMiddelware, PostController.getSavedPosts)
postRouter.post('/comments/get',authMiddelware, PostController.comment)
postRouter.delete('/:commentId',authMiddelware, PostController.deleteComment)
postRouter.delete('/deletepost/:postId',authMiddelware, PostController.deletePost)
postRouter.post('/like/post',authMiddelware, PostController.likePost)
postRouter.post('/like/comment',authMiddelware, PostController.likeComment)
postRouter.post('/save/post',authMiddelware, PostController.saved)
postRouter.get('/recommendations/get',authMiddelware, PostController.getRecommendations)
postRouter.get('/account/:user', authMiddelware, PostController.getPosts)
postRouter.get('/post/:postId', authMiddelware, PostController.getPost)

export default postRouter
