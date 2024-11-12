const fs = require('fs');
const path = require('path');

const commentsFilePath = path.join(__dirname,'../data/comments.json');

const sessionData = require('../config/session.js');

const commentController ={
    createComment:async(req,res)=>{
        const user=sessionData[0];
        console.log(req.body);
        const commentData={
                board_id:req.body.boardId,
                content:req.body.content,
                user_id:user.userId,
                nickname:user.nickname,
                profile:user.profile,
                create_at: new Date()
                }
        console.log(commentData);
        fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
            if(err){
                 console.error('파일 읽기 오류: ',err);
                 return res.status(500).json({success: false, message: '서버 오류'});
            }
            const comments= JSON.parse(data);
            commentData.comment_id = comments.length;
            comments.push(commentData);
            fs.writeFile(commentsFilePath,JSON.stringify(comments,null,2),(err)=>{
                if(err){
                    console.error('파일 저장 오류:',err);
                    return res.status(500).json({success: false,message :'서버 오류'});
                }
                res.status(201).json({success: true, comment:commentData,message: '댓글 작성완료'});
                
            })
            
        });
    },
    getAllComments: async(board_id,res)=>{
        console.log("userId",sessionData[0]);
        fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
            if(err){
                 console.error('파일 읽기 오류: ',err);
                 return res.status(500).json({success: false, message: '서버 오류'});
            }
            const comments= JSON.parse(data);

            const comment = comments.filter(c=> c.board_id=== Number(board_id));
       
            console.log(comment);
            res.status(200).json({comment,userId:sessionData[0].userId});
        });
    }

}

module.exports=commentController;