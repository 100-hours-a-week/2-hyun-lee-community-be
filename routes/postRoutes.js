const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/postController');
const upload = multer({dest:'uploads/files/'});



router.post('/createPost', upload.single('postImage'), postController.createPost);

router.get('/posts',postController.getAllPosts)


router.patch('/details-post/:board_id/likes', (req, res) => {
    const {board_id} = req.body;
    postController.likesUpdate(board_id,res);
    });

router.patch('/detail-post', (req, res) => {
    const board_id=req.query.board_id;
    postController.getPosts(board_id,res);
 });

router.patch('/detail-post/:board_id/editPost',upload.single('postImage'),postController.updatePost);


 router.patch('/details-post/:board_id/commentCount', (req, res) => {
    const {board_id} = req.body;
    postController.commentCountUpdate(board_id,res);
    });


router.delete('/details-post/deletePost', postController.deletePost);

router.delete('/user/deleteUserPosts/:userId',postController.deleteUserPosts)


// router.post('/comment',postController.createComment);

// router.get('/comments', postController.getAllComments);

// router.delete('/comment/:boardId/deleteComment/:commentId', postController.deleteComment);

module.exports=router;