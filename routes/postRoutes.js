const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/postController');
const upload = multer({dest:'uploads/files/'});


router.post('/createPost', upload.single('postImage'), postController.createPost);

router.get('/posts',postController.getAllPosts)

router.get('/details-post/:board_id',(req,res)=>{
    const boardId=req.params.board_id;
    postController.getPosts(boardId,res)
});

module.exports=router;