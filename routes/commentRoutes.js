const express = require('express');
const router = express.Router();
const multer = require('multer');
const commentController = require('../controllers/commentController.js');
const upload = multer({dest:'uploads/files/'});
const path = require('path');


router.get('/posts/:post_id/comments',commentController.getAllComments);

router.post('/posts/:post_id/comment',commentController.createComment);

router.delete('/posts/:post_id/comment/:comment_id',commentController.deleteComment);

router.patch('/posts/:post_id/comment/:comment_id',commentController.updateComment);

router.post('/comment/',commentController.createComment);

router.delete('/user/:user_id',commentController.deleteUserComments)




module.exports=router;