import likeController from "../controllers/likeController.js";
import express from 'express';

const router = express.Router();


router.patch('/posts/likes/:post_id/:user_id', likeController.updateLikes);

router.get('/likes/user/status/:post_id',likeController.userLikesStatus);


export default router;