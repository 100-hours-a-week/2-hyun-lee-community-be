import express from 'express';
import multer from 'multer';
import postController from '../controllers/postController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/files'); 
    },
    filename: (req, file, cb) => {
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const sanitizedFileName = originalName.replace(/\s+/g, '_');
        const uniqueName = `${Date.now()}-${sanitizedFileName}`;
        cb(null, uniqueName);

    },
});
const upload = multer({ storage });




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


export default router;