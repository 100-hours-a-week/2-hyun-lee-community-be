import User from '../models/user.js';
import AWS from 'aws-sdk';
import userService from '../services/userService.js';

const CDN_URL = 'https://d2m8tt5bgy55i.cloudfront.net/';
const S3_URL = 'https://s3.ap-northeast-2.amazonaws.com/hyun.lee.bucket/';

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const userController = {
  createUser: async (req, res, next) => {
    try {
        await userService.createUser(req); 
        res.status(201).json({ success: true, message: '회원가입 성공' });
    } catch (error) {
        next(error);
      }
  },

  login: async (req, res, next) => {
    try {
        const result = await userService.login(req);
        req.session.user = result.sessionData; // 세션 저장
        res.status(200).json({ success: true, message: '로그인 성공', user: result.user });
      }  catch (error) {
            next(error); 
      }
  },

  logout: async (req, res,next) => {
    try {
        await userService.logout(req); 
        res.clearCookie('connect.sid'); 
        res.status(200).json({ success: true, message: '로그아웃 성공' });
      } catch (error) {
        next(error);
      }
  },

  loadUser: async (req, res,next) => {
    try {
        const userInfo = await userService.loadUser(req); 
        res.status(200).json({
          success: true,
          message: '사용자 정보 로드 성공',
          userInfo,
        });
      } catch (error) {
        next(error);
      }
  },

  updateUser: async (req, res,next) => {
    try {
        await userService.updateUser(req);
        res.status(201).json({ success: true, message: '수정 완료' });
      } catch (error) {
        next(error); 
      }
  },

  checkEmail: async (req, res, next) => {
    try {
        const message = await userService.checkEmail(req); 
        res.status(200).json({ success: true, message });
      } catch (error) {
        next(error);
      }
  },

  checkNickname: async (req, res, next) => {
    try {
        const message = await userService.checkNickname(req);
        res.status(200).json({ success: true, message });
      } catch (error) {
        next(error);
      }
  },

  checkNicknameForUpdate: async (req, res, next) => {
    try {
        const message = await userService.checkNicknameForUpdate(req); 
        res.status(200).json({ success: true, message });
      } catch (error) {
        next(error);
      }
  },

  deleteUser: async (req, res, next) => {
    try {
        await userService.deleteUser(req);
        req.session.destroy((err) => {
            if (err) {
              return next(new AppError('세션 삭제 실패', 500));
            }
            res.clearCookie('connect.sid'); 
            return res.status(200).json({ success: true, message: '회원 탈퇴 완료' });
          }); 
      } catch (error) {
        next(error);
      }
  },

  updatePassword: async (req, res, next) => {
    try {
        await userService.updatePassword(req); 
        res.status(200).json({ success: true, message: '비밀번호 수정 완료' });
      } catch (error) {
        next(error);
      }
  },
};

export default userController;
