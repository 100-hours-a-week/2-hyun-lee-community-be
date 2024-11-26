import express from 'express';
import multer from 'multer';
import userController from '../controllers/userController.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); 
    },
    filename: (req, file, cb) => {
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const sanitizedFileName = originalName.replace(/\s+/g, '_');
        const uniqueName = `${Date.now()}-${sanitizedFileName}`;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });



router.post('/users/register', upload.single('profileImage'), userController.createUser);

router.get('/users/email/check', userController.checkEmail);

router.get('/users/nickname/check', userController.checkNickname);

router.get('/users/nickname/update/check', userController.checkNicknameForUpdate);

router.post('/users/login', userController.login);

router.get('/users/logout', userController.logout);

router.get('/user/profile',userController.loadUser);

router.patch('/user/profile',upload.single('profileImage'),userController.updateUser);

router.delete(`/user/:user_id`,userController.deleteUser);

router.patch('/user/password',upload.none(),userController.updatePassword);

// router.post('/users/check', userController.checkLogin);


// router.get('/check-session', (req, res) => {
//     console.log("req::::::",req.session);
//     if (req.session) {
//         res.json({ sessionData: req.session });
//     } else {
//         res.json({ message: 'No session data available' });
//     }
// });

// // 닉네임 중복 확인 라우트
// router.get('/check-nickname', userController.checkNickname);


// //사용자 목록 조회 라우트
// router.get("/users",userController.getUsers);




export default router;