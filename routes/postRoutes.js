const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/postController');
const upload = multer({dest:'uploads/files/'});
const path = require('path');


router.post('/createPost', upload.single('postImage'), postController.createPost);

router.get('/posts',postController.getAllPosts)


router.get('/detail-post', (req, res) => {

   res.sendFile(path.join(__dirname, '..', 'public', 'detail-post.html'));
});

router.get(`/api/detail-post`,(req,res)=>{
    const boardId=req.query.board_id;
    postController.getPosts(boardId,res);
});

router.delete('/details-post/deletePost', postController.deletePost);
module.exports=router;