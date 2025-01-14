import express from 'express';
import multer from 'multer';
import userController from '../controllers/userController.js';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import {validateCreateUser ,validateUpdateUser}  from '../middlewares/validators.js';

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
        const uniqueName = `uploads/${Date.now()}-${sanitizedFileName}`; 
        cb(null, uniqueName);
    },
});
const upload = multer({
    storage,
    limits: {
      fileSize: 1024 * 1024,
    },
});


router.post('/users/register',upload.single('profileImage'),validateCreateUser,userController.createUser);

router.get('/users/email/check', userController.checkEmail);

router.get('/users/nickname/check', userController.checkNickname);

router.get('/users/nickname/update/check', userController.checkNicknameForUpdate);

router.post('/users/login', userController.login);

router.get('/users/logout', userController.logout);

router.get('/user/profile',userController.loadUser);

router.patch('/user/profile',upload.single('profileImage'),validateUpdateUser,userController.updateUser);

router.delete(`/user/:user_id`,userController.deleteUser);

router.patch('/user/password',upload.none(),userController.updatePassword);



export default router;