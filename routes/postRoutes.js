import express from 'express';
import multer from 'multer';
import postController from '../controllers/postController.js';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
const router = express.Router();

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();


const storage = multerS3({
	s3,
	acl:'public-read',
	bucket:'hyun.lee.bucket',
	contentType: multerS3.AUTO_CONTENT_TYPE,
    	key: (req, file, cb) => {
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const sanitizedFileName = originalName.replace(/\s+/g, '_');
        const uniqueName = `uploads/files/${Date.now()}-${sanitizedFileName}`; 
        cb(null, uniqueName);
    },
});


/*
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
*/
const upload = multer({ storage });




router.post('/posts', upload.single('postImage'), postController.createPost);

router.get('/posts',postController.getAllPosts)


router.patch('/posts/likes/:post_id/:user_id', postController.updateLikes);

router.get('/likes/status/:post_id', postController.likesStatus);


router.patch('/posts/:post_id', postController.updateViews);

router.get('/posts/:post_id',postController.getPosts);

router.patch('/posts/update/:post_id',upload.single('postImage'),postController.updatePost);


router.delete('/posts/:post_id', postController.deletePost);

router.delete('/user/:user_id/posts',postController.deleteUserPosts)




export default router;