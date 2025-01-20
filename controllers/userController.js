import User from '../models/user.js';
import AWS from 'aws-sdk';

const CDN_URL = 'https://d2m8tt5bgy55i.cloudfront.net/';
const S3_URL = 'https://s3.ap-northeast-2.amazonaws.com/hyun.lee.bucket/';

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const userController = {
  createUser: async (req, res) => {
    try {
      const { email, password, nickname } = req.body;
      if (!email || !password || !nickname) {
        return res.status(400).json({
          success: false,
          message: '모든 필드를 입력하세요.',
        });
      }
      console.log(req.body);
      const profile_image = req.file
        ? decodeURIComponent(req.file.location.replace(S3_URL, CDN_URL))
        : null;
      const userData = { email, password, nickname, profile_image };

      const result = await User.create(userData);

      return res.status(201).json({ success: true, message: '회원가입 성공' });
    } catch (error) {
      console.error('Error in createUser:', error);
      res.status(500).json({ success: false, message: '서버 오류' });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: '이메일과 비밀번호를 입력하세요.',
        });
    }

    const userData = { email, password };
    try {
      const result = await User.loginCheck(userData);
      console.log('result', result);
      if (result.success) {
        // 세션 정보 저장
        req.session.user = {
          user_id: result.user.user_id,
          email: result.user.email,
          nickname: result.user.nickname,
          profile_image: result.user.profile_image,
        };
        return res
          .status(200)
          .json({ success: true, message: '로그인 성공', user: result.user });
      } else {
        return res
          .status(401)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ message: '서버 오류' });
    }
  },

  logout: async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('세션 삭제 오류:', err);
        return res.status(500).json({ success: false, message: '로그아웃 실패' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({
        success: true,
        message: '로그아웃 성공',
      });
    });
  },

  loadUser: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({
          success: false,
          message: '로그인 상태가 아닙니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '사용자 정보 로드 성공',
        userInfo: req.session.user,
      });
    } catch (error) {
      console.error('Error in loadUser:', error);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  },

  updateUser: async (req, res) => {
    const { user_id, nickname } = req.body;

    if (!user_id || !nickname) {
        return res.status(400).json({
          success: false,
          message: '필수 데이터를 입력하세요.',
        });
    }
    const userData = {
      profileImage: req.file
        ? decodeURIComponent(req.file.location.replace(S3_URL, CDN_URL))
        : null,
        nickname,
    };
    try {
      const userResult = await User.getUser(user_id);

      if (!userResult) {
        return res
          .status(401)
          .json({ success: false, message: '회원 정보를 찾지 못하였습니다.' });
      }
      if (userData.profileImage === null) {
        userData.profileImage = decodeURIComponent(userResult.profile_image);
      }
      const originProfile = userResult.profile_image.replace(CDN_URL, S3_URL);

      await User.updateUser(user_id, userData);

      if (
        userData.profileImage &&
        userResult.profile_image &&
        userResult.profile_image !== userData.profileImage
      ) {
        s3.deleteObject(
          {
            Bucket: 'hyun.lee.bucket',
            Key: decodeURIComponent(
              originProfile.split('amazonaws.com/hyun.lee.bucket/')[1]
            ),
          },
          (err, data) => {
            if (err) {
              throw err;
            }
            console.log('기존 이미지 삭제 성공:', originProfile);
          }
        );
      }

      if (req.session && req.session.user) {
        req.session.user.nickname = userData.nickname;
        req.session.user.profile_image = userData.profileImage;
      }

      res.status(201).json({ message: '수정 완료', success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: '서버 오류' });
    }
  },

  checkEmail: async (req, res) => {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: '이메일을 입력하세요.',
        });
      }
      const emailExists = await User.findByEmail(email);

      if (emailExists) {
        return res
          .status(400)
          .json({ success: false, message: '이미 등록된 이메일 입니다.' });
      }
      return res.status(200).json({
        success: true,
        message: '사용 가능한 이메일입니다.',
      });
    } catch (error) {
      console.error('Error in checkEmail:', error);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  },

  checkNickname: async (req, res) => {
    try {
      const { nickname } = req.query;

      if (!nickname) {
        return res.status(400).json({
          success: false,
          message: '닉네임을 입력하세요.',
        });
      }

      const nicknameExists = await User.checkNickname(nickname);
      if (nicknameExists) {
        return res.status(400).json({
          success: false,
          message: '이미 등록된 닉네임 입니다.',
        });
      }
      return res.status(200).json({
        success: true,
        message: '사용 가능한 닉네임입니다.',
      });
    } catch (error) {
      console.error('Error in checkNickname:', error);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  },

  checkNicknameForUpdate: async (req, res) => {
    try {
      const { nickname, user_id } = req.query;

      if (!nickname || !user_id) {
        return res.status(400).json({
          success: false,
          message: '닉네임과 사용자 ID를 모두 입력하세요.',
        });
      }

      const nicknameExists = await User.checkNicknameForUpdate(nickname, user_id);
      if (nicknameExists) {
        return res.status(400).json({
          success: false,
          message: '이미 등록된 닉네임 입니다.',
        });
      }
      return res.status(200).json({
        success: true,
        message: '사용 가능한 닉네임입니다.',
      });
    } catch (error) {
      console.error('Error in checkNicknameForUpdate:', error);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  },

  deleteUser: async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 사용자 ID입니다.',
        });
      }

    const userProfile = req.session.user.profile_image;
    const originProfile = userProfile.replace(CDN_URL, S3_URL);

    try {
      s3.deleteObject(
        {
          Bucket: 'hyun.lee.bucket',
          Key: decodeURIComponent(
            originProfile.split('amazonaws.com/hyun.lee.bucket/')[1]
          ),
        },
        (err, data) => {
          if (err) {
            throw err;
          }
          console.log('기존 이미지 삭제 성공:', originProfile);
        }
      );
      const result = User.deleteUser(user_id);

      if (!result) {
        return res
          .status(400)
          .json({ success: false, message: '유저가 존재하지 않습니다.' });
      }

      req.session.destroy((err) => {
        if (err) {
          console.error('세션 삭제 오류:', err);
          return res
            .status(500)
            .json({ success: false, message: '세션 삭제 실패' });
        }

        res.clearCookie('connect.sid');
        return res.status(200).json({
          success: true,
          message: '회원 탈퇴 완료',
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { password, confirmPassword, user_id } = req.body;

      if (!password || !confirmPassword || !user_id) {
        return res.status(400).json({
          success: false,
          message: '모든 필드를 입력하세요.',
        });
      }
      
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: '비밀번호가 다릅니다.',
        });
      }

      const userResult = await User.getUser(user_id);
      if (!userResult) {
        return res.status(400).json({
          success: false,
          message: '유저가 존재하지 않습니다.',
        });
      }
      await User.updateUserPassword(user_id, password);

      return res.status(200).json({
        success: true,
        message: '비밀번호 수정 완료',
      });
    } catch (error) {
      console.error('Error in updatePassword:', error);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  },
};

export default userController;
