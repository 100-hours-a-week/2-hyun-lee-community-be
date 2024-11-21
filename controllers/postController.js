import Post from '../models/post.js'; 
import fs from 'fs'; 
import path from 'path'; 
import sessionData from '../config/session.js'; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);


const postsFilePath = path.join(__dirname, '../data/posts.json');
const commentsFilePath = path.join(__dirname, '../data/comments.json');




// const postController={
//     createPost: async(req,res)=>{
//         const user = req.session.user;

   
//         console.log("user session",req.session.user);
//         const postData ={
//             postTitle:req.body.postTitle,
//             postContent: req.body.postContent,
//             userId:user.userId,
//             userNickname:user.nickname,
//             postImage: req.file ? req.file.path : null
//         };
//         console.log('post',postData);
//         try{
//             const result= await Post.create(postData);
//             console.log('result',result);
//             return res.status(201).json({
//                 message:'게시글 작성 완료'
//             });
//         }catch (error) {
//             console.error('Error creating post:', error);
//             res.status(500).json({ message: '서버 오류' });
//         }
//     },
//     getAllPosts: async (req, res) => {
//         const user = req.session;
//        console.log("user session gg:",req.session.user);
//         try {
//             const posts = await Post.getAllPosts();
//             res.status(200).json(posts);
//         } catch (error) {
//             console.error('게시글 조회 중 오류:', error);
//             res.status(500).json({ message: '게시글 조회 실패' });
//         }
//     },

//     getPosts: async (board_id, res) => {
//         try {
//             const posts = await Post.getPosts(board_id);
            
//             //console.log(posts);
//             res.status(200).json(posts);
//         } catch (error) {
//             console.error('게시글 조회 중 오류:', error);
//             res.status(500).json({ message: '게시글 조회 실패' });
//         }
//     },
//     deletePost: async(req,res)=>{
//         try{
            
//             const {board_id}=req.query;
//             const user=req.session.user;
//             const post = await Post.getPosts(board_id);
//             if (!post) {
//                 return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
//             }

//             if (post[0][0].user_id !== user.userId) {
//                 return res.status(403).json({ success: false, message: '삭제 권한이 없습니다.' });
//             }
    
//             const result=await Post.deletePost(board_id);
//             if (result) {
//                 return res.status(200).json({ success: true, message: '게시글이 삭제되었습니다.' });
//             } else {
//                 return res.status(500).json({ success: false, message: '게시글 삭제에 실패했습니다.' });
//             }
//         }
//         catch(error){
//             console.error('게시글 삭제 중 오류:', error);
//             res.status(500).json({ success: false,message: '서버 오류' });
    
//         }
//     },
//     createComment: async(req,res)=>{
//         try{
//             const user=req.session.user;
//             const commentData={
//                 board_id:req.body.boardId,
//                 content:req.body.content,
//                 user_id:user.userId,
//                 userNickname:user.nickname,
//                 userProfile:user.profile
//             }
//             const resultData= await Post.createComment(commentData);
//             if (resultData) {
//                 return res.status(200).json({ resultData,success: true, message: '댓글이 작성되었습니다.' });
//             } else {
//                 return res.status(500).json({ success: false, message: '댓글 작성에 실패했습니다.' });
//             }
//         } catch(error){
//             console.error('댓글 작성중 오류:', error);
//             res.status(500).json({ success: false,message: '서버 오류' });
    
//         }
//     },
//     getAllComments : async(req,res)=>{
//         const { board_id } = req.query;
//         const userId=req.session.user.userId;
//         try{
//             const resultData=await Post.getAllComments(board_id);
//             if (resultData) {
//                 return res.status(200).json({ resultData,userId,success: true, message: '전체 댓글 조회' });
//             } else {
//                 return res.status(500).json({ success: false, message: '댓글 조회에 실패하였습니다.' });
//             }
//         } catch(error){
//             console.error('댓글 조회중 오류:', error);
//             res.status(500).json({ success: false,message: '서버 오류' });
//         }
//     },
//     deleteComment: async(req,res)=>{
//          try{
//             const { boardId, commentId } = req.params;
//             const data={
//                 boardId,commentId
//             }
            
//             const user=req.session.user;
       
//             const comment = await Post.getComments(data);

//             if (!comment) {
//                 return res.status(404).json({ success: false, message: '댓글을 찾을 수 없습니다.' });
//             }

//             if (comment[0][0].user_id !== user.userId) {
//                 return res.status(403).json({ success: false, message: '삭제 권한이 없습니다.' });
//             }
//             const resultData=await Post.deleteComment(data);
//             if (resultData) {
//                 return res.status(200).json({ success: true, message: '댓글이 삭제되었습니다.' });
//             } else {
//                 return res.status(500).json({ success: false, message: '댓글 삭제에 실패했습니다.' });
//             }
//         } catch(error){

//         }
//  }
// };

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
                    page_image: req.file ? req.file.path : 'uploads/d5d3a97711245d8bea727e5448a2c60c',
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
            post.page_title=req.body.postTitle;
            post.page_content=req.body.postContent;
            post.page_image=req.file ? req.file.path : 'uploads/d5d3a97711245d8bea727e5448a2c60c';
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
    } ,
    commentCountUpdate:async(req,res)=>{
        const {post_id} = req.params;
        console.log("asdasdasd",post_id);
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
    }

}

export default postController;