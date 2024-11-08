const express = require('express');
const router = express.Router();
const userController= require('../controllers/userController');
const multer = require('multer');
const postController = require('../controllers/postController');
const upload = multer({dest:'uploads/'});


router.post('/register', upload.single('profileImage'), userController.createUser);




router.post('/login', userController.login);

router.get('/check-email', userController.checkEmail);

router.post('/check-login', userController.checkLogin);

// 닉네임 중복 확인 라우트
router.get('/check-nickname', userController.checkNickname);


//사용자 목록 조회 라우트
router.get("/users",userController.getUsers);



module.exports=router;