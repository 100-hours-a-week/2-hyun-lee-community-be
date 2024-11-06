const User = require('../models/user');
const bcrypt = require('bcrypt');
const userController={
    createUser: async (req,res,next)=>{
        const userData = {
            useremail: req.body.useremail,
            password: req.body.password,
            nickname: req.body.nickname,
            profile: req.file ? req.file.path : null, // 파일 경로
        };
        console.log(userData);

        
        try{
            const result= await User.create(userData);
            console.log("회원가입 id",result.insertId);
            return res.status(201).json({
                message: '회원가입 성공',
                userId:result.insertId
            });
        } catch(error){
            res.status(500).json({message:'서버 오류'});
        }
    },
    login: async (req,res)=>{
        const {useremail,password}=req.body;
        const userData={useremail,password};
        try{
            const result=await User.loginCheck(userData);
            console.log(result);
            if(result.success){
                //세션 정보 저장
                req.session.user={
                    userId:result.user.user_id,
                    useremail:result.user.useremail,
                    nickname: result.user.nickname
                };
                return res.status(200).json({message: result.message, user:result.user});
            } else{
                return res.status(401).json({message:result.message});
            } 

        } catch(error){
            res.status(500).json({message:'서버 오류'});
        }
    },

    getUsers: async(req,res)=>{
        const { offset, limit } = req.query;
            if (!offset) {
                return res.status(400).json({ code: 'invalid_offset' });
              }
              
            if (!limit) {
                return res.status(400).json({ code: 'invalid_limit' });
              }
            const offsetInt = parseInt(offset);
            const limitInt = parseInt(limit);
            
            if (isNaN(offsetInt) || isNaN(limitInt)) {
                return res.status(400).json({ code: 'invalid_parameters' });
            }
            
            const requestData = { offset: offsetInt, limit: limitInt };
            try {
                const responseData = await User.findAll(requestData);
                console.log('getUsers Controllers:', responseData);
                return res.status(200).json(responseData);
              } catch (error) {
                console.error('Error loading users:', error);
                return res.status(500).json({ code: 'internal_server_error' });
              }

    },
    checkEmail : async(req,res)=>{
        try{
            const email =req.query.email;
            const isDuplicated=await User.findByEmail(email);
            res.json({isDuplicated});
        } catch(error){
            res.status(500).json({message: '서버 오류'});
        }
    },
    
    checkNickname: async(req,res)=>{
        try{
            const nickname =req.query.nickname;
            const isDuplicated=await User.findByNickname(nickname);
            res.json({isDuplicated});
        } catch(error){
            res.status(500).json({message: '서버 오류'});
        }
    }
    
};

module.exports=userController;