import express from 'express';
import multer from 'multer';
import commentController from '../controllers/commentController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/files/' });

router.get('/posts/:post_id/comments',commentController.getAllComments);

router.get('/posts/:comment_id/comment',commentController.getComment);

router.post('/posts/:post_id/comment',commentController.createComment);

router.delete('/posts/:post_id/comment/:comment_id',commentController.deleteComment);

router.patch('/posts/:post_id/comment/:comment_id',commentController.updateComment);

router.post('/comment/',commentController.createComment);

router.delete('/user/:user_id/comments',commentController.deleteUserComments)




export default router;