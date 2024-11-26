import User from '../models/user.js'; 
import bcrypt from 'bcrypt';
import fs from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const usersFilePath = path.join(__dirname, '../data/users.json');
const postsFilePath = path.join(__dirname, '../data/posts.json');
const commentsFilePath = path.join(__dirname, '../data/comments.json');


import sessionData from '../config/session.js'; 



// const userController={
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
        try{
            const { useremail, password, nickname } = req.body;
            const profile = req.file ? req.file.path : null; // 파일 경로
            const userData = {useremail, password, nickname, profile};


            const result= await User.create(userData);
            
            return res.status(201).json({
            message: '회원가입 성공',
            success:true
            });
        } catch(error){
            console.error('Error in createUser:', error); // 자세한 에러 로그 출력
            res.status(500).json({success:false,message:'서버 오류'});
        }
    },
    // createUser: async (req,res)=>{
    //     const { useremail, password, nickname } = req.body;
    //     const profile = req.file ? req.file.path : null; // 파일 경로
    //     const newUser = {
    //             useremail,
    //             password,
    //             nickname,
    //             profile
            
    //         };

    //     fs.readFile(usersFilePath,'utf-8',(err,data)=>{
    //         if(err){
    //             console.error('파일 읽기 오류: ',err);
    //             return res.status(500).json({message: '서버 오류'});
    //         }
    //         const users= JSON.parse(data);

    //         const maxId = users.length > 0 ? Math.max(...users.map(user => user.user_id)) : 0;            
    //         newUser.user_id = maxId+1;
    //         users.push(newUser);
    //         fs.writeFile(usersFilePath,JSON.stringify(users,null,2),(err)=>{
    //             if(err){
    //                 console.error('파일 저장 오류:',err);
    //                 return res.status(500).json({success: false,message :'서버 오류'});
    //             }
    //             res.status(201).json({
    //                 message: '회원가입 성공',
    //                 user_id:newUser.user_id,
    //                 success:true
    //             });
    //         });
    //     })
                
    // },
    login: async (req,res)=>{
                const {useremail,password}=req.body;
                const userData={useremail,password};
                try{
                    const result=await User.loginCheck(userData);
                    console.log("result",result);
                    if(result.success){
                       
                        //세션 정보 저장
                        req.session.user={
                            user_id:result.user.user_id,
                            useremail:result.user.useremail,
                            nickname: result.user.nickname,
                            profile : result.user.profile
                        };
                    
                        return res.status(200).json({ success: true, message: '로그인 성공', user:result.user});
                    } else{
                        return res.status(401).json({ success: false,message:result.message});
                    } 
        
                } catch(error){
                    res.status(500).json({message:'서버 오류'});
                }
            },
    // login: async (req,res)=>{
    //             const {useremail,password}=req.body;
    //             const userData={useremail,password};
    //             console.log("userData",userData);

    //          fs.readFile(usersFilePath,'utf-8',(err,data)=>{
    //             if(err){
    //                  console.error('파일 읽기 오류: ',err);
    //                  return res.status(500).json({success: false,message: '서버 오류'});
    //             }

    //             const users= JSON.parse(data)|| [];

    //             //유지 정보 찾기
    //             const user = users.find(u => u.useremail === useremail && u.password === password);
                
    //             if (!user) {
    //                 return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    //             }

    //             const sessionUser={
    //                 user_id: user.user_id,
    //                 useremail: user.useremail,
    //                 nickname: user.nickname,
    //                 profile: user.profile
           
    //             }
    //             sessionData.push(sessionUser);
    //             res.status(200).json({ success: true, message: '로그인 성공', user: user });
    //         });
    //     },
    
    // logout : async(req,res)=>{
    //     if(!sessionData){
    //         return res.status(500).json({success: false, message: '서버 오류'});
    //     }
    //     sessionData.pop();
    //     res.status(200).json({success:true, message: '로그아웃 성공'});
    // },
    logout : async(req,res)=>{
        req.session.destroy((err) => {
            if (err) {
                console.error('세션 삭제 오류:', err);
                return res.status(500).json({ success: false, message: '로그아웃 실패' });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ success: true, message: '로그아웃 성공' });
        });
    
    },

        // loadUser : async(req,res)=>{
            
        //     if(!sessionData){
        //         return res.status(500).json({success: false, message: '서버 오류'});
        //     }
        //     res.status(200).json({userInfo :sessionData[0],success:true, message: '프로필이미지 로드 성공'});

        // },

    loadUser : async(req,res)=>{
            
        if(!req.session.user){
            return res.status(500).json({success: false, message: '서버 오류'});
        }
        res.status(200).json({userInfo :req.session.user,success:true, message: '프로필이미지 로드 성공'});

    },
    // updateUser : async(req,res)=>{
    //     const profileImage = req.file ? req.file.path : null; 
    //     const nickname=req.body.nickname;
    //     const user_id=req.body.user_id;


    //         fs.readFile(usersFilePath,'utf-8',(err,data)=>{
    //             if(err){
    //                  console.error('파일 읽기 오류: ',err);
    //                  return res.status(500).json({success: false, message: '서버 오류'});
    //             }

    //             const users= JSON.parse(data)|| [];

    //             //유지 정보 찾기
    //             const user = users.find(u => u.user_id === Number(user_id));
    //             console.log("u",user);
                
    //             if (!user) {
    //                 return res.status(401).json({ success: false, message: '회원 정보를 찾지 못하였습니다.' });
    //             }
    //             const allUser=users.filter(u => !(u.user_id === Number(user_id)));
            
    //             //닉네임 중복 확인
    //             if(allUser.some(user=> user.nickname === nickname)){
    //                 return res.status(400).json({result:"nickname" ,message: '이미 등록된 닉네임 입니다.'});
    //             }

    //             const oldProfilePath = user.profile;

    //             user.nickname=nickname;
    //             if(profileImage){
    //                 user.profile = profileImage;
    //                 fs.readFile(postsFilePath,'utf-8',(err,data)=>{
    //                     if(err){
    //                         console.error('파일 읽기 오류: ',err);
    //                         return res.status(500).json({success: false, message: '서버 오류'});
    //                         }
    //                     const posts = JSON.parse(data)|| [];

    //                     const userPosts = posts.filter(p => p.user_id === Number(user_id));

    //                     userPosts.forEach(post => {
    //                         post.profile = profileImage;
    //                         post.nickname = nickname;
    //                     });

    //                     fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
    //                         if (err) {
    //                             console.error('파일 쓰기 오류:', err);
    //                             return res.status(500).json({success: false, message: '서버 오류' });
    //                         }
    //                     });    
    //                 })

    //                 fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
    //                     if(err){
    //                          console.error('파일 읽기 오류: ',err);
    //                          return res.status(500).json({success: false, message: '서버 오류'});
    //                     }
    //                     const comments= JSON.parse(data)||[];

                        
    //                     const userComments = comments.filter(c=> c.user_id === Number(user_id));

    //                     userComments.forEach(comment=>{
    //                         comment.profile=profileImage;
    //                         comment.nickname=nickname;
    //                     })
                   
    //                     fs.writeFile(commentsFilePath,JSON.stringify(comments,null,2),(err)=>{
    //                         if(err){
    //                             console.error('파일 저장 오류:',err);
    //                             return res.status(500).json({success: false,message :'서버 오류'});
    //                         }  
    //                     });
                        
    //                 });
                    
    //                 if (oldProfilePath && oldProfilePath !== profileImage) {
    //                     fs.unlink(oldProfilePath, (unlinkErr) => {
    //                         if (unlinkErr) {
    //                             console.error('기존 파일 삭제 오류:', unlinkErr);
    //                         } else {
    //                             console.log('기존 파일 삭제 완료:', oldProfilePath);
    //                         }
    //                     });
    //                 } 
    //             }

    //             //세션 업데이트
    //             sessionData[0].nickname=nickname;
    //             sessionData[0].profile=profileImage;

    //             fs.writeFile(usersFilePath,JSON.stringify(users,null,2),(err)=>{
    //                 if(err){
    //                     console.error('파일 저장 오류:',err);
    //                     return res.status(500).json({ success:false, message :'서버 오류'});
    //                 }
    //                 res.status(201).json({
    //                     message: '수정 완료',
    //                     success:true
    //                 });
    //             });

    //         });

          
    //     },
    updateUser : async(req,res)=>{
        const user_id=req.body.user_id; 
        const userData ={
            profileImage : req.file ? req.file.path : null,
            nickname : req.body.nickname
        }


        try{
        const userResult = await User.getUser(user_id);

        if (!userResult) {
            return res.status(401).json({ success: false, message: '회원 정보를 찾지 못하였습니다.' });
        }
        if(userData.profileImage ===null){
            userData.profileImage = userResult.profile;
        }

        console.log("user Data :",userData);
        await User.updateUser(user_id,userData);
        
        if (userData.profileImage && userResult.profile && userResult.profile !== userData.profileImage) {
            fs.unlink(userResult.profile, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('기존 파일 삭제 오류:', unlinkErr);
                } else {
                    console.log('기존 파일 삭제 완료:', userResult.profile);
                }
            });
        }
        

        if (req.session && req.session.user) {
            req.session.user.nickname = userData.nickname;
            req.session.user.profile = userData.profileImage;
        } 

        res.status(201).json({message: '수정 완료',success:true}); 
        } catch(error){
            console.error(error);
            res.status(500).json({ success: false, message: '서버 오류' });
        }
    

          
        },
        // checkEmail : async (req,res)=>{
        //     const email = req.query.email;
           
        //     fs.readFile(usersFilePath,'utf-8',(err,data)=>{
        //         if(err){
        //             console.error('파일 읽기 오류: ',err);
        //             return res.status(500).json({message: '서버 오류'});
        //         }
        //         const users= JSON.parse(data);
    
        //         //이메일 중복 확인
        //         if(users.some(user=> user.useremail === email)){
        //             return res.status(400).json({success: false,message: '이미 등록된 이메일 입니다.'});
        //         }
        //         res.status(200).json({ success: true, message: '등록된 이메일이 없습니다.' });
        //     });
        // },
        checkEmail : async (req,res)=>{
            const email = req.query.email;
            const emailExists = await User.findByEmail(email);
            if (emailExists) {
                return res.status(400).json({success: false,message: '이미 등록된 이메일 입니다.'});
            } 

            res.status(200).json({ success: true, message: '등록된 이메일이 없습니다.' });
            
        },
        // checkNickname: async(req,res)=>{
        //     const nickname = req.query.nickname;
        //     fs.readFile(usersFilePath,'utf-8',(err,data)=>{
        //         if(err){
        //             console.error('파일 읽기 오류: ',err);
        //             return res.status(500).json({message: '서버 오류'});
        //         }
        //         const users= JSON.parse(data);
    
        //         //닉네임 중복 확인
        //         if(users.some(user=> user.nickname === nickname)){
        //             return res.status(400).json({success:false ,message: '이미 등록된 닉네임 입니다.'});
        //         }
        //         res.status(200).json({ success: true, message: '등록된 닉네임이 없습니다.' });
        //     })
        // },
        checkNickname: async(req,res)=>{
            const nickname = req.query.nickname;
            const nicknameExists = await User.checkNickname(nickname);
            if (nicknameExists) {
                return res.status(400).json({success:false,message: '이미 등록된 닉네임 입니다.'});
            }
            res.status(200).json({ success: true, message: '등록된 닉네임이 없습니다.' });
        
        },

        checkNicknameForUpdate: async(req,res)=>{
            const nickname = req.query.nickname;
            const user_id = req.query.user_id;
            const nicknameExists = await User.checkNicknameForUpdate(nickname,user_id);
            if (nicknameExists) {
                return res.status(400).json({success:false,message: '이미 등록된 닉네임 입니다.'});
            }
            res.status(200).json({ success: true, message: '등록된 닉네임이 없습니다.' });
        
        },

        deleteUser :async(req,res)=>{
            const {user_id}=req.params;

            try{
                const result = User.deleteUser(user_id);

                if(!result){
                return res.status(400).json({success:false,message: '유저가 존재하지 않습니다.'});
            }
            
            req.session.destroy((err) => {
                if (err) {
                    console.error("세션 삭제 오류:", err);
                    return res.status(500).json({ success: false, message: "세션 삭제 실패" });
                }
    
                res.clearCookie('connect.sid');
                res.status(200).json({ success: true, message: "회원 탈퇴 완료" });
            });
            } catch(error){
                console.error(error);
            }  
        },

        updatePassword: async(req,res)=>{
            const password = req.body.password; 
            const confirmPassword=req.body.confirmPassword;
            const user_id=req.body.user_id;

           console.log("rr",req.body);
            fs.readFile(usersFilePath,'utf-8',(err,data)=>{
                if(err){
                     console.error('파일 읽기 오류: ',err);
                     return res.status(500).json({success: false,message: '서버 오류'});
                }

                const users= JSON.parse(data)|| [];

                
                //유지 정보 찾기
                const user = users.find(u => (u.user_id === Number(user_id)));
                console.log(user);
                if (!user) {
                    return res.status(401).json({ success: false, message: '회원 정보가 없습니다.' });
                }

                user.password=password;
               
                fs.writeFile(usersFilePath,JSON.stringify(users,null,2),(err)=>{
                    if(err){
                        console.error('파일 저장 오류:',err);
                        return res.status(500).json({ success:false, message :'서버 오류'});
                    }
                    res.status(201).json({
                        message: '비밀번호 수정 완료',
                        success:true
                    });
                });
            });
        }

    };


export default userController