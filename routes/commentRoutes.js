const express = require('express');
const router = express.Router();
const multer = require('multer');
const commentController = require('../controllers/commentController.js');
const upload = multer({dest:'uploads/files/'});
const path = require('path');


router.get('/comments',(req,res)=>{
    const post_id=req.query.post_id;
    commentController.getAllComments(post_id,res);
});

router.post('/comment',commentController.createComment);

router.delete('/comment/:post_id/deleteComment/:commentId',commentController.deleteComment);

router.patch('/comment/:post_id/updateComment/:commentId',commentController.updateComment);

router.post('/comment/',commentController.createComment);

router.delete('/user/deleteUserComments/:userId',commentController.deleteUserComments)




module.exports=router;