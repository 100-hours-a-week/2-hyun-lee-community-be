import fs from 'fs'; 
import path from 'path'; 
import sessionData from '../config/session.js'; 
import { fileURLToPath } from 'url';
import { console } from 'inspector';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);


const postsFilePath = path.join(__dirname, '../data/posts.json');
const commentsFilePath = path.join(__dirname, '../data/comments.json');

const postController ={
    getAllPosts: async (req,res)=>{
        fs.readFile(postsFilePath,'utf-8',(err,data)=>{
            if(err){
                 console.error('파일 읽기 오류: ',err);
                 return res.status(500).json({success: false, message: '서버 오류'});
            }
            const posts= JSON.parse(data);
            res.status(200).json({posts});
        });
    },
    createPost: async(req,res)=>{
      
                    const postData ={
                    page_title:req.body.postTitle,
                    page_content: req.body.postContent,
                    user_id:sessionData[0].user_id,
                    nickname:sessionData[0].nickname,
                    profile:sessionData[0].profile,
                    page_image: req.file ? req.file.path : '',
                    create_at: new Date(),
                    view_count:0,
                    likes_count:0,
                    comment_count:0,
                };
                fs.readFile(postsFilePath,'utf-8',(err,data)=>{
                    if(err){
                         console.error('파일 읽기 오류: ',err);
                         return res.status(500).json({success: false, message: '서버 오류'});
                    }
                    const posts= JSON.parse(data);

                    const maxId = posts.length > 0 ? Math.max(...posts.map(post => post.post_id)) : 0;            
                    postData.post_id = maxId+1;
                    posts.push(postData);
                    fs.writeFile(postsFilePath,JSON.stringify(posts,null,2),(err)=>{
                        if(err){
                            console.error('파일 저장 오류:',err);
                            return res.status(500).json({success: false,message :'서버 오류'});
                        }
                        res.status(201).json({success: true, message: '게시글 작성완료'});
                        
                    })
                    
                });
    },
    getPosts: async (req, res) => {
        const {post_id}=req.params;
        const user_id=sessionData[0].user_id;
        fs.readFile(postsFilePath,'utf-8',(err,data)=>{
            if(err){
                console.error('파일 읽기 오류: ',err);
                return res.status(500).json({success: false, message: '서버 오류'});
                }
            const posts= JSON.parse(data);
    
            const post = posts.find(p=> p.post_id=== Number(post_id));
            post.view_count += 1;
            fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
                if (err) {
                    console.error('파일 쓰기 오류:', err);
                    return res.status(500).json({ success: false, message: '서버 오류' });
                }
    
                
                res.status(200).json({post,user_id});
            });
                      
        });
    },
    deletePost: async(req,res)=>{
        const{post_id} = req.params;
 
        //게시글 관련 댓글 삭제
        fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
         if(err){
              console.error('파일 읽기 오류: ',err);
              return res.status(500).json({success: false, message: '서버 오류'});
         }
         const comments= JSON.parse(data);
         
         const comment = comments.filter(c=>!(c.post_id === Number(post_id)));
    
         fs.writeFile(commentsFilePath,JSON.stringify(comment,null,2),(err)=>{
             if(err){
                 console.error('파일 저장 오류:',err);
                 return res.status(500).json({success: false,message :'서버 오류'});
             }  
         });
         
         });
        //게시글 삭제
        fs.readFile(postsFilePath,'utf-8',(err,data)=>{
         if(err){
             console.error('파일 읽기 오류: ',err);
             return res.status(500).json({success: false, message: '서버 오류'});
             }
         const posts= JSON.parse(data);
 
         const post = posts.filter(p=> !(p.post_id=== Number(post_id)));
         
         fs.writeFile(postsFilePath, JSON.stringify(post, null, 2), (err) => {
             if (err) {
                 console.error('파일 쓰기 오류:', err);
                 return res.status(500).json({success: false, message: '서버 오류' });
             }
 
             
             res.status(200).json({ success: true, message: '게시글 및 댓글 삭제 완료' });
         });
         });
 
         
     },
     updatePost:async(req,res)=>{
        const {post_id}=req.params;
        console.log(req.body);
        fs.readFile(postsFilePath,'utf-8',(err,data)=>{
            if(err){
                console.error('파일 읽기 오류: ',err);
                return res.status(500).json({success: false, message: '서버 오류'});
                }
            const posts= JSON.parse(data);

            const post = posts.find(p=> p.post_id=== Number(post_id));   

            const oldImagePath = post.page_image;
           
            
            post.page_title=req.body.postTitle;
            post.page_content=req.body.postContent;
            if (req.body.postDelete === 'true') {
                if (oldImagePath) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error('기존 이미지 삭제 오류:', err);
                        } else {
                            console.log('기존 이미지 삭제 성공:', oldImagePath);
                        }
                    });
                }
                post.page_image = ''; 
            } else {
                if(!req.file){
                    post.page_image=oldImagePath;
                } else {
                post.page_image = req.file.path;
                if (oldImagePath) {
                    fs.unlink(oldImagePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('기존 파일 삭제 오류:', unlinkErr);
                        } else {
                            console.log('기존 파일 삭제 완료:', oldImagePath);
                        }
                    });
                } 
                }
            }
            
            post.create_at=new Date();
            console.log("postsSSss:",post);

        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                console.error('파일 쓰기 오류:', err);
                return res.status(500).json({success: false, message: '서버 오류' });
            }

            
            res.status(200).json({ success: true, message: '게시글 수정 완료' });
        });
                                 
        });
    },
     likesUpdate: async (req,res)=>{
        const {post_id} = req.params;
        fs.readFile(postsFilePath,'utf-8',(err,data)=>{
            if(err){
                console.error('파일 읽기 오류: ',err);
                return res.status(500).json({success: false, message: '서버 오류'});
                }
            const posts= JSON.parse(data);

            const post = posts.find(p=> p.post_id=== Number(post_id));
      
            post.likes_count += 1;

        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                console.error('파일 쓰기 오류:', err);
                return res.status(500).json({success: false, message: '서버 오류' });
            }

            
            res.status(200).json({ success: true, message: '좋아요 업데이트 완료' });
        });
                                 
        });
    },
    commentCountUpdate:async(req,res)=>{
        const {post_id} = req.params;
        fs.readFile(postsFilePath,'utf-8',(err,data)=>{
            if(err){
                console.error('파일 읽기 오류: ',err);
                return res.status(500).json({success: false, message: '서버 오류'});
                }
            const posts= JSON.parse(data);

            const post = posts.find(p=> p.post_id=== Number(post_id));
      
            post.comment_count += 1;

        fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                console.error('파일 쓰기 오류:', err);
                return res.status(500).json({success: false, message: '서버 오류' });
            }

            
            res.status(200).json({ success: true, message: '댓글수 업데이트 완료' });
             });
         });
    },

    deleteUserPosts: async(req,res)=>{
        const {user_id}=req.params;

        console.log("user",user_id);
        fs.readFile(postsFilePath,'utf-8',(err,data)=>{
            if(err){
                console.error('파일 읽기 오류: ',err);
                return res.status(500).json({success: false, message: '서버 오류'});
            }
            const posts= JSON.parse(data);

            const post = posts.filter(p=> !(p.user_id=== Number(user_id)));
            
            console.log("post",post);
            fs.writeFile(postsFilePath, JSON.stringify(post, null, 2), (err) => {
                if (err) {
                    console.error('파일 쓰기 오류:', err);
                    return res.status(500).json({success: false, message: '서버 오류' });
                }

                
                res.status(200).json({ success: true, message: '모든 게시글 삭제 완료' });
            });
        });
    },
}

export default postController;