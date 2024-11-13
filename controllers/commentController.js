const fs = require('fs');
const path = require('path');

const commentsFilePath = path.join(__dirname,'../data/comments.json');
const postsFilePath = path.join(__dirname,'../data/posts.json');

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
       
            res.status(200).json({comment,userId:sessionData[0].userId});
        });
    },
    deleteComment:async(req,res)=>{
        const {boardId,commentId}=req.params;
        fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
            if(err){
                 console.error('파일 읽기 오류: ',err);
                 return res.status(500).json({success: false, message: '서버 오류'});
            }
            const comments= JSON.parse(data);
            
            const comment = comments.filter(c=>  !(c.board_id === Number(boardId) && c.comment_id === Number(commentId)));
       
            fs.writeFile(commentsFilePath,JSON.stringify(comment,null,2),(err)=>{
                if(err){
                    console.error('파일 저장 오류:',err);
                    return res.status(500).json({success: false,message :'서버 오류'});
                }
                res.status(201).json({success: true, message: '댓글 삭제완료'});   
            });
            
       });
       //댓글수 감소
       fs.readFile(postsFilePath,'utf-8',(err,data)=>{
        if(err){
             console.error('파일 읽기 오류: ',err);
             return res.status(500).json({success: false, message: '서버 오류'});
        }
        const posts= JSON.parse(data);
        const post= posts.find(p=> p.board_id===Number(boardId));
        post.comment_count -= 1;
        fs.writeFile(postsFilePath,JSON.stringify(posts,null,2),(err)=>{
            if(err){
                console.error('파일 저장 오류:',err);
                return res.status(500).json({success: false,message :'서버 오류'});
            }
        })
        
    });

    },
    updateComment : async (req,res)=>{
        const {boardId,commentId}=req.params;
        const newContent=req.body.content;
        fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
            if(err){
                 console.error('파일 읽기 오류: ',err);
                 return res.status(500).json({success: false, message: '서버 오류'});
            }
            const comments= JSON.parse(data);
            
            const comment = comments.find(c=>  c.board_id === Number(boardId) && c.comment_id === Number(commentId));
       
            comment.content=newContent;
            comment.create_at=new Date();

            fs.writeFile(commentsFilePath,JSON.stringify(comments,null,2),(err)=>{
                if(err){
                    console.error('파일 저장 오류:',err);
                    return res.status(500).json({success: false,message :'서버 오류'});
                }
                res.status(201).json({success: true, message: '댓글 수정완료'});   
            });
            
       });
    },
    deleteUserComments:async(req,res)=>{
        const {userId}=req.params;
        fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
            if(err){
                 console.error('파일 읽기 오류: ',err);
                 return res.status(500).json({success: false, message: '서버 오류'});
            }
            const comments= JSON.parse(data);
            
            const allComment = comments.filter(c=> (c.user_id === Number(userId)));
            const comment = comments.filter(c=> !(c.user_id === Number(userId)));
            
            fs.readFile(postsFilePath,'utf-8',(err,data)=>{
                if(err){
                     console.error('파일 읽기 오류: ',err);
                     return res.status(500).json({success: false, message: '서버 오류'});
                }
                const posts= JSON.parse(data);

                allComment.forEach(c=>{
                    const post = posts.find(p=>p.board_id===Number(c.board_id));
                    post.comment_count -= 1;
                }); 

                fs.writeFile(postsFilePath,JSON.stringify(posts,null,2),(err)=>{
                    if(err){
                        console.error('파일 저장 오류:',err);
                        return res.status(500).json({success: false,message :'서버 오류'});
                    }
                });

                fs.writeFile(commentsFilePath,JSON.stringify(comment,null,2),(err)=>{
                    if(err){
                        console.error('파일 저장 오류:',err);
                        return res.status(500).json({success: false,message :'서버 오류'});
                    }
                    res.status(201).json({success: true, message: '모든 댓글 삭제 완료'});   
                });

            });
 });
           
            // fs.writeFile(commentsFilePath,JSON.stringify(comment,null,2),(err)=>{
            //     if(err){
            //         console.error('파일 저장 오류:',err);
            //         return res.status(500).json({success: false,message :'서버 오류'});
            //     }
            //     res.status(201).json({success: true, message: '댓글 삭제완료'});   
            // });
       
    }

}

module.exports=commentController;