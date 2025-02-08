import User from '../models/user.js'; 
import AWS from 'aws-sdk'

const S3_URL = 'https://s3.ap-northeast-2.amazonaws.com/hyun.lee.bucket/';
const CDN_URL = 'https://d2m8tt5bgy55i.cloudfront.net/';


AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });
  
const s3 = new AWS.S3();


export  async function validateCreateUser(req, res, next){
    const { email, password, confirmPassword, nickname } = req.body;
    const profile_image = req.file ? decodeURIComponent(req.file.location.replace(S3_URL,CDN_URL)) : null;
    const userData = {email, password, nickname, profile_image};
    const errors =[];
    //프로필 이미지 검증
    if(!profile_image){
        errors.push('프로필 사진을 추가해주세요.');
    }
    //이메일 검증
    if (!/^[a-zA-Z0-9.!_%+-]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(email)) {
        errors.push('올바른 이메일 주소 형식을 입력해주세요.');
    } else {
        const emailExists = await User.findByEmail(email);
        if (emailExists) {
            errors.push('중복된 이메일 입니다.');
        }
    }
    //비밀번호 검증
    if(password.length < 8 || password.length > 20 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>=+\_\-~`//]/.test(password)){
        errors.push('비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.');
    }
    if (password !== confirmPassword) {
        errors.push('비밀번호가 다릅니다.');
    }
    //닉네임 검증
    if (nickname.length > 10) {
        errors.push('닉네임은 최대 10자까지 작성 가능합니다.');
    }
    if (/\s/.test(nickname)) {
        errors.push('닉네임 띄어쓰기 불가능합니다.');
    } else {
        const nicknameExists = await User.checkNickname(nickname);
        if (nicknameExists) {
            errors.push('중복된 닉네임 입니다.');
        }
    }
    if (errors.length > 0) {
            if (userData.profile_image) {
                const uploadedImageKey = decodeURIComponent(
                    userData.profile_image.replace(CDN_URL, S3_URL).split('amazonaws.com/hyun.lee.bucket/')[1]
                );
                await s3.deleteObject(
                    {
                        Bucket: 'hyun.lee.bucket',
                        Key: uploadedImageKey
                    },
                    (err, data) => {
                        if (err) {
                            console.error('이미지 삭제 오류:', err);
                        } else {
                            console.log('검증 실패로 업로드된 이미지 삭제 성공:', userData.profile_image);
                        }
                    }
                ).promise(); 
            }
            return res.status(400).json({ success: false, message: errors });
    }
    next();
}

export  async function validateUpdateUser(req,res,next){
    const user_id=req.body.user_id; 
    const userData ={
        profileImage :  req.file ? decodeURIComponent(req.file.location.replace(S3_URL,CDN_URL))  : null,
        nickname : req.body.nickname
    }
    const errors =[];
    //닉네임 검증
    if (userData.nickname.length > 10) {
        errors.push('닉네임은 최대 10자까지 작성 가능합니다.');
    }
    if (/\s/.test(userData.nickname)) {
        errors.push('닉네임 띄어쓰기 불가능합니다.');
    } else {
        const nicknameExists = await User.checkNicknameForUpdate(userData.nickname,user_id);
        if (nicknameExists) {
            errors.push('중복된 닉네임 입니다.');
        }
    }
    if (errors.length > 0) {
        if (userData.profileImage) {
            const uploadedImageKey = decodeURIComponent(
                userData.profileImage.replace(CDN_URL, S3_URL).split('amazonaws.com/hyun.lee.bucket/')[1]
            );
            await s3.deleteObject(
                {
                    Bucket: 'hyun.lee.bucket',
                    Key: uploadedImageKey
                },
                (err, data) => {
                    if (err) {
                        console.error('이미지 삭제 오류:', err);
                    } else {
                        console.log('검증 실패로 업로드된 이미지 삭제 성공:', userData.profileImage);
                    }
                }
            ).promise(); 
        }
        return res.status(400).json({ success: false, message: errors });
    }
    next();
}


export function validatePassword(req, res, next) {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
  
    const errors = [];
  
    if (!password || !confirmPassword) {
      errors.push("*비밀번호와 비밀번호 확인을 입력해주세요.");
    }
  
    
    if (password !== confirmPassword) {
      errors.push("*비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    }
  
    
    if (
      password.length < 8 ||
      password.length > 20 ||
      !/[A-Z]/.test(password) || 
      !/[a-z]/.test(password) || 
      !/[0-9]/.test(password) || 
      !/[!@#$%^&*(),.?":{}|<>=+\_\-~`//]/.test(password) 
    ) {
      errors.push(
        "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다."
      );
    }
  
    
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors });
    }
  
    
    next();
  }

export function validatePostTitle(req,res,next){
    const user = req.session.user;
    const { postTitle, postContent } = req.body;

    const errors = [];

    if (postTitle.length > 26) {
        errors.push("*제목을 26자 이하로 작성해주세요.");
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors });
    }
    
      
      next();
}
  