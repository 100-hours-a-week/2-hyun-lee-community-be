import express from 'express';
import multer from 'multer';
import commentController from '../controllers/commentController.js';
import { checkAuth, checkCommentOwnership, checkOwnershipParam } from '../middlewares/checkAuth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/files/' });

router.get('/posts/:post_id/comments',commentController.getAllComments);

router.get('/posts/:comment_id/comment',commentController.getComment);

router.post('/posts/:post_id/comment',checkAuth,commentController.createComment);

router.delete('/posts/:post_id/comment/:comment_id',checkAuth,checkCommentOwnership,commentController.deleteComment);

router.patch('/posts/:post_id/comment/:comment_id',checkAuth,checkCommentOwnership,commentController.updateComment);

router.post('/comment/',checkAuth,commentController.createComment);

//router.delete('/user/:user_id/comments',checkAuth,checkOwnershipParam,commentController.deleteUserComments)




export default router;