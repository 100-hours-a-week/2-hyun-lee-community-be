const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/postController');
const upload = multer({dest:'uploads/files/'});



router.post('/posts', upload.single('postImage'), postController.createPost);

router.get('/posts',postController.getAllPosts)


router.patch('/posts/likes/:post_id', postController.likesUpdate);

router.patch('/posts/:post_id',postController.getPosts);

router.patch('/posts/update/:post_id',upload.single('postImage'),postController.updatePost);


 router.patch('/posts/comments/counts/:post_id', postController.commentCountUpdate);


router.delete('/posts/:post_id', postController.deletePost);

router.delete('/user/:user_id/posts',postController.deleteUserPosts)


// router.post('/comment',postController.createComment);

// router.get('/comments', postController.getAllComments);

// router.delete('/comment/:post_id/deleteComment/:commentId', postController.deleteComment);

module.exports=router;