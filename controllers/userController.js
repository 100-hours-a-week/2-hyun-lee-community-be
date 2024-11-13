const User = require('../models/user');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname,'../data/users.json');

//임시 세션
const sessionData =  require('../config/session.js');


// const userController={
//     createUser: async (req,res,next)=>{
//         const userData = {
//             useremail: req.body.useremail,
//             password: req.body.password,
//             nickname: req.body.nickname,
//             profile: req.file ? req.file.path : null, // 파일 경로
//         };
//         console.log("session:",req.session);
        
//         try{
//             const result= await User.create(userData);
//             console.log("회원가입 id",result.insertId);
//             return res.status(201).json({
//                 message: '회원가입 성공',
//                 userId:result.insertId,
//                 ok:true
//             });
//         } catch(error){
//             res.status(500).json({ok:false,message:'서버 오류'});
//         }
//     },
//     login: async (req,res)=>{
//         const {useremail,password}=req.body;
//         const userData={useremail,password};
//         console.log("userData",userData);
//         try{
//             const result=await User.loginCheck(userData);
//             console.log("result",result);
//             if(result.success){
//                 //세션 정보 저장
//                 req.session.user={
//                     userId:result.user.user_id,
//                     useremail:result.user.useremail,
//                     nickname: result.user.nickname,
//                     profile : result.user.profile
//                 };
//                 console.log("result::::",result);
//                 console.log("로그인 후 세션 설정:", req.session);
//                 return res.status(200).json({message: result.message, user:result.user});
//             } else{
//                 return res.status(401).json({message:result.message});
//             } 

//         } catch(error){
//             res.status(500).json({message:'서버 오류'});
//         }
//     },
//     checkLogin: async (req,res)=>{
//         const {email,password}=req.body;
//         const userData={email,password};
//         try{
//             const result=await User.loginCheck(userData);
//             console.log(result);
//                 return res.status(200).json({success:result.success,message: result.message, user:result.user});

//         } catch(error){
//             res.status(500).json({success:false,message:'서버 오류'});
//         }
//     },

//     getUsers: async(req,res)=>{
//         const { offset, limit } = req.query;
//             if (!offset) {
//                 return res.status(400).json({ code: 'invalid_offset' });
//               }
              
//             if (!limit) {
//                 return res.status(400).json({ code: 'invalid_limit' });
//               }
//             const offsetInt = parseInt(offset);
//             const limitInt = parseInt(limit);
            
//             if (isNaN(offsetInt) || isNaN(limitInt)) {
//                 return res.status(400).json({ code: 'invalid_parameters' });
//             }
            
//             const requestData = { offset: offsetInt, limit: limitInt };
//             try {
//                 const responseData = await User.findAll(requestData);
//                 console.log('getUsers Controllers:', responseData);
//                 return res.status(200).json(responseData);
//               } catch (error) {
//                 console.error('Error loading users:', error);
//                 return res.status(500).json({ code: 'internal_server_error' });
//               }

//     },
//     checkEmail : async(req,res)=>{
//         try{
//             const email =req.query.email;
//             const isDuplicated=await User.findByEmail(email);
//             res.json({isDuplicated});
//         } catch(error){
//             res.status(500).json({message: '서버 오류'});
//         }
//     },
    
//     checkNickname: async(req,res)=>{
//         try{
//             const nickname =req.query.nickname;
//             const isDuplicated=await User.findByNickname(nickname);
//             res.json({isDuplicated});
//         } catch(error){
//             res.status(500).json({message: '서버 오류'});
//         }
//     },
    
// };

const userController ={
    createUser: async (req,res)=>{
        const { useremail, password, nickname } = req.body;
        const profile = req.file ? req.file.path : null; // 파일 경로
        const newUser = {
                useremail,
                password,
                nickname,
                profile
            
            };

        fs.readFile(usersFilePath,'utf-8',(err,data)=>{
            if(err){
                console.error('파일 읽기 오류: ',err);
                return res.status(500).json({message: '서버 오류'});
            }
            const users= JSON.parse(data);

            //이메일 중복 확인
            if(users.some(user=> user.useremail === useremail)){
                return res.status(400).json({result:"email",message: '이미 등록된 이메일 입니다.'});
            }
            //닉네임 중복 확인
            if(users.some(user=> user.nickname === nickname)){
                return res.status(400).json({result:"nickname" ,message: '이미 등록된 닉네임 입니다.'});
            }
            newUser.userId = users.length;

            users.push(newUser);
            fs.writeFile(usersFilePath,JSON.stringify(users,null,2),(err)=>{
                if(err){
                    console.error('파일 저장 오류:',err);
                    return res.status(500).json({message :'서버 오류'});
                }
                res.status(201).json({
                    message: '회원가입 성공',
                    userId:newUser.id,
                    ok:true
                });
            });
        })
                
    },
    login: async (req,res)=>{
                const {useremail,password}=req.body;
                const userData={useremail,password};
                console.log("userData",userData);



             fs.readFile(usersFilePath,'utf-8',(err,data)=>{
                if(err){
                     console.error('파일 읽기 오류: ',err);
                     return res.status(500).json({message: '서버 오류'});
                }

                const users= JSON.parse(data)|| [];

                //유지 정보 찾기
                const user = users.find(u => u.useremail === useremail && u.password === password);
                
                if (!user) {
                    return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
                }

                const sessionUser={
                    userId: user.userId,
                    useremail: user.useremail,
                    nickname: user.nickname,
                    profile: user.profile
           
                }
                sessionData.push(sessionUser);
                res.status(200).json({ success: true, message: '로그인 성공', user: user });
            });
        },
        
        logout : async(req,res)=>{
            if(!sessionData){
                return res.status(500).json({success: false, message: '서버 오류'});
            }
            sessionData.pop();
            res.status(200).json({success:true, message: '로그아웃 성공'});
        },

        loadProfile : async(req,res)=>{
            if(!sessionData){
                return res.status(500).json({success: false, message: '서버 오류'});
            }
            res.status(200).json({profileImage:sessionData[0].profile,success:true, message: '프로필이미지 로드 성공'});

        }

    };


module.exports=userController;