import likeController from "../controllers/likeController.js";
import express from 'express';
import { checkAuth, checkOwnershipParam } from '../middlewares/checkAuth.js';
const router = express.Router();


router.patch('/posts/likes/:post_id/:user_id',checkAuth,checkOwnershipParam,likeController.updateLikes);

router.get('/likes/user/status/:post_id',likeController.userLikesStatus);


export default router;