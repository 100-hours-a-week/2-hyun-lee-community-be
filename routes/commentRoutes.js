const express = require('express');
const router = express.Router();
const multer = require('multer');
const commentController = require('../controllers/commentController.js');
const upload = multer({dest:'uploads/files/'});
const path = require('path');


router.get('/comments',(req,res)=>{
    const board_id=req.query.board_id;
    commentController.getAllComments(board_id,res);
});

router.post('/comment',commentController.createComment);

router.delete('/comment/:boardId/deleteComment/:commentId',commentController.deleteComment)

module.exports=router;