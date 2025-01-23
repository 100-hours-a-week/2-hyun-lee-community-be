import User from '../models/user.js';
import s3 from '../utils/awsS3.js';
import AppError from '../utils/AppError.js';

const CDN_URL = 'https://d2m8tt5bgy55i.cloudfront.net/';
const S3_URL = 'https://s3.ap-northeast-2.amazonaws.com/hyun.lee.bucket/';



const createUser = async (req) => {

    const { email, password, nickname } = req.body;
    if (!email || !password || !nickname) {
        throw new AppError('이메일과 비밀번호를 입력하세요.', 400);
    }
  
    const profile_image = req.file
      ? decodeURIComponent(req.file.location.replace(S3_URL, CDN_URL))
      : null;
  
    const userData = { email, password, nickname, profile_image };
    return await User.create(userData);
};

const login = async (req) =>{
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('이메일과 비밀번호를 입력하세요.', 400);
    }

    const result = await User.loginCheck({ email, password });
    if (!result.success) {
        throw new AppError(result.message, 401); 
      }
      console.log('result', result);
      return {
        sessionData: {
          user_id: result.user.user_id,
          email: result.user.email,
          nickname: result.user.nickname,
          profile_image: result.user.profile_image,
        },
        user: result.user,
      };
};

const logout = async (req) =>{
    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            return reject(new AppError('세션 삭제 실패', 500));
          }
          resolve();
        });
      });
}

const loadUser = async (req) => {
    if (!req.session.user) {
       throw new AppError('로그인 상태가 아닙니다.',401);
    }
    return req.session.user;
}

const updateUser = async (req) => {
    const { user_id, nickname } = req.body;

    if (!user_id || !nickname) {
        throw new AppError('닉네임과 사용자 ID를 입력하세요.', 400); 
      }
    const userData = {
      profileImage: req.file
        ? decodeURIComponent(req.file.location.replace(S3_URL, CDN_URL))
        : null,
        nickname,
    };
    const userResult = await User.getUser(user_id);
    if (!userResult) {
      throw new AppError('회원 정보를 찾지 못하였습니다.', 404);
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

}

const checkEmail = async(req) => {
    const { email } = req.query;

    if (!email) {
        throw new AppError('이메일을 입력하세요.', 400);
      }
    const exists = await User.findByEmail(email);
    
    if (exists) {
        throw new AppError('이미 등록된 이메일입니다.', 400);
    }

    return '사용 가능한 이메일입니다.';
}

const checkNickname = async (req) => {
    const { nickname } = req.query;

    if (!nickname) {
        throw new AppError('닉네임을 입력하세요.', 400);
      }

    const exists = await User.checkNickname(nickname);
    
    if (exists) {
        throw new AppError('이미 등록된 닉네임입니다.', 400);
    }

  return '사용 가능한 닉네임입니다.';
};

const checkNicknameForUpdate = async (req) => {
    const { nickname, user_id } = req.query;

    if (!nickname || !user_id) {
        throw new AppError('닉네임과 사용자 ID를 입력하세요.', 400);
      }

    const exists = await User.checkNicknameForUpdate(nickname, user_id);
    
    if (exists) {
        throw new AppError('이미 등록된 닉네임입니다.', 400);
    }

    return '사용 가능한 닉네임입니다.';
}

const deleteUser = async (req) => {
    const { user_id } = req.params;

    if (!user_id) {
        throw new AppError('유효하지 않은 사용자 ID입니다.', 400);
    }

    const userProfile = req.session.user.profile_image;
    const originProfile = userProfile.replace(CDN_URL, S3_URL);

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
        throw new AppError('유저가 존재하지 않습니다.', 404);
      }

}

const updatePassword = async(req) => {
    const { password, confirmPassword, user_id } = req.body;

    if (!password || !confirmPassword || !user_id) {
        throw new AppError('모든 필드를 입력하세요.', 400);
      }

      if (password !== confirmPassword) {
        throw new AppError('비밀번호가 일치하지 않습니다.', 400);
      }

    const userResult = await User.getUser(user_id);
    if (!userResult) {
    throw new AppError('유저가 존재하지 않습니다.', 404); 
    }
    await User.updateUserPassword(user_id, password);
}

export default {
    createUser,
    login,
    logout,
    loadUser,
    updateUser,
    checkEmail,
    checkNickname,
    checkNicknameForUpdate,
    deleteUser,
    updatePassword
  };