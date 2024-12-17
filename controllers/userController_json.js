import fs from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url';
import sessionData from '../config/session.js'; 

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const usersFilePath = path.join(__dirname, '../data/users.json');
const postsFilePath = path.join(__dirname, '../data/posts.json');
const commentsFilePath = path.join(__dirname, '../data/comments.json');



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

            const maxId = users.length > 0 ? Math.max(...users.map(user => user.user_id)) : 0;            
            newUser.user_id = maxId+1;
            users.push(newUser);
            fs.writeFile(usersFilePath,JSON.stringify(users,null,2),(err)=>{
                if(err){
                    console.error('파일 저장 오류:',err);
                    return res.status(500).json({success: false,message :'서버 오류'});
                }
                res.status(201).json({
                    message: '회원가입 성공',
                    user_id:newUser.user_id,
                    success:true
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
                     return res.status(500).json({success: false,message: '서버 오류'});
                }

                const users= JSON.parse(data)|| [];

                //유지 정보 찾기
                const user = users.find(u => u.useremail === useremail && u.password === password);
                
                if (!user) {
                    return res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
                }

                const sessionUser={
                    user_id: user.user_id,
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
      loadUser : async(req,res)=>{
            
            if(!sessionData){
                return res.status(500).json({success: false, message: '서버 오류'});
            }
            res.status(200).json({userInfo :sessionData[0],success:true, message: '프로필이미지 로드 성공'});

        },
 updateUser : async(req,res)=>{
        const profileImage = req.file ? req.file.path : null; 
        const nickname=req.body.nickname;
        const user_id=req.body.user_id;


            fs.readFile(usersFilePath,'utf-8',(err,data)=>{
                if(err){
                     console.error('파일 읽기 오류: ',err);
                     return res.status(500).json({success: false, message: '서버 오류'});
                }

                const users= JSON.parse(data)|| [];

                //유지 정보 찾기
                const user = users.find(u => u.user_id === Number(user_id));
                console.log("u",user);
                
                if (!user) {
                    return res.status(401).json({ success: false, message: '회원 정보를 찾지 못하였습니다.' });
                }
                const allUser=users.filter(u => !(u.user_id === Number(user_id)));
            
                //닉네임 중복 확인
                if(allUser.some(user=> user.nickname === nickname)){
                    return res.status(400).json({result:"nickname" ,message: '이미 등록된 닉네임 입니다.'});
                }

                const oldProfilePath = user.profile;

                user.nickname=nickname;
                if(profileImage){
                    user.profile = profileImage;
                    fs.readFile(postsFilePath,'utf-8',(err,data)=>{
                        if(err){
                            console.error('파일 읽기 오류: ',err);
                            return res.status(500).json({success: false, message: '서버 오류'});
                            }
                        const posts = JSON.parse(data)|| [];

                        const userPosts = posts.filter(p => p.user_id === Number(user_id));

                        userPosts.forEach(post => {
                            post.profile = profileImage;
                            post.nickname = nickname;
                        });

                        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
                            if (err) {
                                console.error('파일 쓰기 오류:', err);
                                return res.status(500).json({success: false, message: '서버 오류' });
                            }
                        });    
                    })

                    fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
                        if(err){
                             console.error('파일 읽기 오류: ',err);
                             return res.status(500).json({success: false, message: '서버 오류'});
                        }
                        const comments= JSON.parse(data)||[];

                        
                        const userComments = comments.filter(c=> c.user_id === Number(user_id));

                        userComments.forEach(comment=>{
                            comment.profile=profileImage;
                            comment.nickname=nickname;
                        })
                   
                        fs.writeFile(commentsFilePath,JSON.stringify(comments,null,2),(err)=>{
                            if(err){
                                console.error('파일 저장 오류:',err);
                                return res.status(500).json({success: false,message :'서버 오류'});
                            }  
                        });
                        
                    });
                    
                    if (oldProfilePath && oldProfilePath !== profileImage) {
                        fs.unlink(oldProfilePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('기존 파일 삭제 오류:', unlinkErr);
                            } else {
                                console.log('기존 파일 삭제 완료:', oldProfilePath);
                            }
                        });
                    } 
                }

                //세션 업데이트
                sessionData[0].nickname=nickname;
                sessionData[0].profile=profileImage;

                fs.writeFile(usersFilePath,JSON.stringify(users,null,2),(err)=>{
                    if(err){
                        console.error('파일 저장 오류:',err);
                        return res.status(500).json({ success:false, message :'서버 오류'});
                    }
                    res.status(201).json({
                        message: '수정 완료',
                        success:true
                    });
                });

            });

          
        },
        checkEmail : async (req,res)=>{
            const email = req.query.email;
           
            fs.readFile(usersFilePath,'utf-8',(err,data)=>{
                if(err){
                    console.error('파일 읽기 오류: ',err);
                    return res.status(500).json({message: '서버 오류'});
                }
                const users= JSON.parse(data);
    
                //이메일 중복 확인
                if(users.some(user=> user.useremail === email)){
                    return res.status(400).json({success: false,message: '이미 등록된 이메일 입니다.'});
                }
                res.status(200).json({ success: true, message: '등록된 이메일이 없습니다.' });
            });
        },
        checkNickname: async(req,res)=>{
            const nickname = req.query.nickname;
            fs.readFile(usersFilePath,'utf-8',(err,data)=>{
                if(err){
                    console.error('파일 읽기 오류: ',err);
                    return res.status(500).json({message: '서버 오류'});
                }
                const users= JSON.parse(data);
    
                //닉네임 중복 확인
                if(users.some(user=> user.nickname === nickname)){
                    return res.status(400).json({success:false ,message: '이미 등록된 닉네임 입니다.'});
                }
                res.status(200).json({ success: true, message: '등록된 닉네임이 없습니다.' });
            })
        },
         updatePassword: async(req,res)=>{
            const password = req.body.password; 
            const confirmPassword=req.body.confirmPassword;
            const user_id=req.body.user_id;

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
}


export default userController