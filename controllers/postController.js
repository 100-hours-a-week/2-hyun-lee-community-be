const Post = require('../models/post'); 
const { post } = require('../routes/userRoutes');

const fs = require('fs');
const path = require('path');

const PostsFilePath = path.join(__dirname,'../data/posts.json');


//임시 세션
const sessionData = require('../config/session.js');

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
        const user = sessionData[0];
        fs.readFile(PostsFilePath,'utf-8',(err,data)=>{
            if(err){
                 console.error('파일 읽기 오류: ',err);
                 return res.status(500).json({message: '서버 오류'});
            }
            const posts= JSON.parse(data);
            console.log(posts);
            res.status(200).json({posts});
        });
    },
    createPost: async(req,res)=>{
      
        
                    const postData ={
                    page_title:req.body.postTitle,
                    postContent: req.body.postContent,
                    userId:sessionData[0].userId,
                    nickname:sessionData[0].nickname,
                    profile:sessionData[0].profile,
                    postImage: req.file ? req.file.path : null,
                    create_at: new Date(),
                    view_count:0,
                    likes_count:0,
                    comment_count:0,
                };
                fs.readFile(PostsFilePath,'utf-8',(err,data)=>{
                    if(err){
                         console.error('파일 읽기 오류: ',err);
                         return res.status(500).json({message: '서버 오류'});
                    }
                    const posts= JSON.parse(data);
                    posts.board_id = posts.length;
                    posts.push(postData);
                    fs.writeFile(PostsFilePath,JSON.stringify(posts,null,2),(err)=>{
                        if(err){
                            console.error('파일 저장 오류:',err);
                            return res.status(500).json({success: false,message :'서버 오류'});
                        }
                        res.status(201).json({success: true, message: '게시글 작성완료'});
                        
                    })
                    
                });
                

                    
            },

}

module.exports=postController;