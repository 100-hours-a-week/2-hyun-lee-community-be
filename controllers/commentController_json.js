import fs from 'fs';
import path from 'path';
import sessionData from '../config/session.js'; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

const commentsFilePath = path.join(__dirname,'../data/comments.json');
const postsFilePath = path.join(__dirname,'../data/posts.json');

const commentController ={
    createComment:async(req,res)=>{
        const user=sessionData[0];
        const {post_id} = req.params;
        const id = Number(post_id);
        const commentData={
                post_id:id,
                content:req.body.content,
                user_id:user.user_id,
                nickname:user.nickname,
                profile:user.profile,
                create_at: new Date()
                }
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
    getAllComments: async(req,res)=>{
       const {post_id} = req.params;
    
        fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
            if(err){
                 console.error('파일 읽기 오류: ',err);
                 return res.status(500).json({success: false, message: '서버 오류'});
            }
            const comments= JSON.parse(data);

            const comment = comments.filter(c=> c.post_id=== Number(post_id));
            console.log(comment);
            res.status(200).json({comment,user_id:sessionData[0].user_id});
        });
    },
     deleteComment:async(req,res)=>{
        const {post_id,comment_id}=req.params;
        fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
            if(err){
                 console.error('파일 읽기 오류: ',err);
                 return res.status(500).json({success: false, message: '서버 오류'});
            }
            const comments= JSON.parse(data);
            
            const comment = comments.filter(c=>  !(c.post_id === Number(post_id) && c.comment_id === Number(comment_id)));
       
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
        const post= posts.find(p=> p.post_id===Number(post_id));
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
        const {post_id,comment_id}=req.params;
        const newContent=req.body.content;
        fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
            if(err){
                 console.error('파일 읽기 오류: ',err);
                 return res.status(500).json({success: false, message: '서버 오류'});
            }
            const comments= JSON.parse(data);
            
            const comment = comments.find(c=>  c.post_id === Number(post_id) && c.comment_id === Number(comment_id));
       
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
        const {user_id}=req.params;
        fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
            if(err){
                 console.error('파일 읽기 오류: ',err);
                 return res.status(500).json({success: false, message: '서버 오류'});
            }
            const comments= JSON.parse(data);
            
            const allComment = comments.filter(c=> (c.user_id === Number(user_id)));
            const comment = comments.filter(c=> !(c.user_id === Number(user_id)));
            
            fs.readFile(postsFilePath,'utf-8',(err,data)=>{
                if(err){
                     console.error('파일 읽기 오류: ',err);
                     return res.status(500).json({success: false, message: '서버 오류'});
                }
                const posts= JSON.parse(data);

                allComment.forEach(c=>{
                    const post = posts.find(p=>p.post_id===Number(c.post_id));
                    if(post){
                        post.comment_count -= 1;

                    }                    
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
    },


}


export default commentController;