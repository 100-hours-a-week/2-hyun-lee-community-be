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


router.patch('/details-post/:board_id/commentCount', (req, res) => {
    const {board_id} = req.body;
    postController.commentUpdate(board_id,res);
    });

module.exports=router;