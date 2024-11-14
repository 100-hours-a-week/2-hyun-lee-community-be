const express = require('express');
const router = express.Router();
const userController= require('../controllers/userController');
const multer = require('multer');
const upload = multer({dest:'uploads/'});


router.post('/users/register', upload.single('profileImage'), userController.createUser);




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



module.exports=router;