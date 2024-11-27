import Post from '../models/post.js'; 
import Comment from '../models/comment.js';
import fs from 'fs'; 
import path from 'path'; 
import sessionData from '../config/session.js'; 
import { fileURLToPath } from 'url';
import { console } from 'inspector';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);


const postsFilePath = path.join(__dirname, '../data/posts.json');
const commentsFilePath = path.join(__dirname, '../data/comments.json');




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
    
    // getAllPosts: async (req,res)=>{
    //     fs.readFile(postsFilePath,'utf-8',(err,data)=>{
    //         if(err){
    //              console.error('파일 읽기 오류: ',err);
    //              return res.status(500).json({success: false, message: '서버 오류'});
    //         }
    //         const posts= JSON.parse(data);
    //         res.status(200).json({posts});
    //     });
    // },
    getAllPosts: async (req, res) => {
                const user = req.session;
            
                try {
                    const posts = await Post.getAllPosts();
                    res.status(200).json( {success: true,posts});
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ success:false,message: '게시글 조회 실패' });
                }
            },
    // createPost: async(req,res)=>{
      
    //                 const postData ={
    //                 page_title:req.body.postTitle,
    //                 page_content: req.body.postContent,
    //                 user_id:sessionData[0].user_id,
    //                 nickname:sessionData[0].nickname,
    //                 profile:sessionData[0].profile,
    //                 page_image: req.file ? req.file.path : '',
    //                 create_at: new Date(),
    //                 view_count:0,
    //                 likes_count:0,
    //                 comment_count:0,
    //             };
    //             fs.readFile(postsFilePath,'utf-8',(err,data)=>{
    //                 if(err){
    //                      console.error('파일 읽기 오류: ',err);
    //                      return res.status(500).json({success: false, message: '서버 오류'});
    //                 }
    //                 const posts= JSON.parse(data);

    //                 const maxId = posts.length > 0 ? Math.max(...posts.map(post => post.post_id)) : 0;            
    //                 postData.post_id = maxId+1;
    //                 posts.push(postData);
    //                 fs.writeFile(postsFilePath,JSON.stringify(posts,null,2),(err)=>{
    //                     if(err){
    //                         console.error('파일 저장 오류:',err);
    //                         return res.status(500).json({success: false,message :'서버 오류'});
    //                     }
    //                     res.status(201).json({success: true, message: '게시글 작성완료'});
                        
    //                 })
                    
    //             });
    //         },
    createPost: async(req,res)=>{
        const user = req.session.user;
        const postData ={
            postTitle:req.body.postTitle,
            postContent: req.body.postContent,
            userId:user.user_id,
            userNickname:user.nickname,
            page_image: req.file ? req.file.path : '',
        };
        try{
            const result= await Post.create(postData);
            return res.status(201).json({success: true,message:'게시글 작성 완료'});
        }catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: '서버 오류' });
        }
    },
    // getPosts: async (req, res) => {
    //     const {post_id}=req.params;
    //     const user_id=sessionData[0].user_id;
    //     fs.readFile(postsFilePath,'utf-8',(err,data)=>{
    //         if(err){
    //             console.error('파일 읽기 오류: ',err);
    //             return res.status(500).json({success: false, message: '서버 오류'});
    //             }
    //         const posts= JSON.parse(data);
    
    //         const post = posts.find(p=> p.post_id=== Number(post_id));
    //         post.view_count += 1;
    //         fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
    //             if (err) {
    //                 console.error('파일 쓰기 오류:', err);
    //                 return res.status(500).json({ success: false, message: '서버 오류' });
    //             }
    
                
    //             res.status(200).json({post,user_id});
    //         });
                      
    //     });
    // },
    getPosts: async (req, res) => {
        const {post_id}=req.params;
        const user_id = req.session.user.user_id;
        try {
            const posts = await Post.getPosts(post_id);
            
            res.status(200).json({success:true, posts,user_id:user_id, message :'게시글 조회 성공'});
        } catch (error) {
            console.error(error);
            res.status(500).json({ success:false,message: '게시글 조회 실패' });
        }
    },

    updateViews: async(req,res)=>{
        const {post_id}=req.params;
        try{
            await Post.updateViews(post_id);
            res.status(200).json({success:true, message :'조회수 업데이트 성공'});
        }catch (error) {
            console.error(error);
            res.status(500).json({ success:false,message: '조회수 업데이트 실패' });
        }
    },
    // deletePost: async(req,res)=>{
    //     const{post_id} = req.params;
 
    //     //게시글 관련 댓글 삭제
    //     fs.readFile(commentsFilePath,'utf-8',(err,data)=>{
    //      if(err){
    //           console.error('파일 읽기 오류: ',err);
    //           return res.status(500).json({success: false, message: '서버 오류'});
    //      }
    //      const comments= JSON.parse(data);
         
    //      const comment = comments.filter(c=>!(c.post_id === Number(post_id)));
    
    //      fs.writeFile(commentsFilePath,JSON.stringify(comment,null,2),(err)=>{
    //          if(err){
    //              console.error('파일 저장 오류:',err);
    //              return res.status(500).json({success: false,message :'서버 오류'});
    //          }  
    //      });
         
    //      });
    //     //게시글 삭제
    //     fs.readFile(postsFilePath,'utf-8',(err,data)=>{
    //      if(err){
    //          console.error('파일 읽기 오류: ',err);
    //          return res.status(500).json({success: false, message: '서버 오류'});
    //          }
    //      const posts= JSON.parse(data);
 
    //      const post = posts.filter(p=> !(p.post_id=== Number(post_id)));
         
    //      fs.writeFile(postsFilePath, JSON.stringify(post, null, 2), (err) => {
    //          if (err) {
    //              console.error('파일 쓰기 오류:', err);
    //              return res.status(500).json({success: false, message: '서버 오류' });
    //          }
 
             
    //          res.status(200).json({ success: true, message: '게시글 및 댓글 삭제 완료' });
    //      });
    //      });
 
         
    //  },
    deletePost: async(req,res)=>{
       const{post_id} = req.params;

       try {
        await Comment.deleteAllComments(post_id);
        await Post.deletePost(post_id);
        res.status(200).json({success:true, message:"게시글 삭제 성공"});
        } catch (error) {
        console.error(error);
        res.status(500).json({ success:false,message: '서버 오류' });
    }
        
    },
    // updatePost:async(req,res)=>{
    //     const {post_id}=req.params;
    //     console.log(req.body);
    //     fs.readFile(postsFilePath,'utf-8',(err,data)=>{
    //         if(err){
    //             console.error('파일 읽기 오류: ',err);
    //             return res.status(500).json({success: false, message: '서버 오류'});
    //             }
    //         const posts= JSON.parse(data);

    //         const post = posts.find(p=> p.post_id=== Number(post_id));   

    //         const oldImagePath = post.page_image;
           
            
    //         post.page_title=req.body.postTitle;
    //         post.page_content=req.body.postContent;
    //         if (req.body.postDelete === 'true') {
    //             if (oldImagePath) {
    //                 fs.unlink(oldImagePath, (err) => {
    //                     if (err) {
    //                         console.error('기존 이미지 삭제 오류:', err);
    //                     } else {
    //                         console.log('기존 이미지 삭제 성공:', oldImagePath);
    //                     }
    //                 });
    //             }
    //             post.page_image = ''; 
    //         } else {
    //             if(!req.file){
    //                 post.page_image=oldImagePath;
    //             } else {
    //             post.page_image = req.file.path;
    //             if (oldImagePath) {
    //                 fs.unlink(oldImagePath, (unlinkErr) => {
    //                     if (unlinkErr) {
    //                         console.error('기존 파일 삭제 오류:', unlinkErr);
    //                     } else {
    //                         console.log('기존 파일 삭제 완료:', oldImagePath);
    //                     }
    //                 });
    //             } 
    //             }
    //         }
            
    //         post.create_at=new Date();
    //         console.log("postsSSss:",post);

    //     fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
    //         if (err) {
    //             console.error('파일 쓰기 오류:', err);
    //             return res.status(500).json({success: false, message: '서버 오류' });
    //         }

            
    //         res.status(200).json({ success: true, message: '게시글 수정 완료' });
    //     });
                                 
    //     });
    // },
    updatePost:async(req,res)=>{
        const {post_id}=req.params;
        const  postData ={
            postTitle:req.body.postTitle,
            postContent: req.body.postContent,
            page_image: req.file ? req.file.path : '',
            postDelete: req.body.postDelete === 'true', 
        }
        try{
            const post = await Post.getPosts(post_id);
            
            if (!post) {
                return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
            }

        
            const oldImagePath = post[0].page_image;
        
            if (postData.postDelete) {
            
                if (oldImagePath) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error('기존 이미지 삭제 오류:', err);
                        } else {
                            console.log('기존 이미지 삭제 성공:', oldImagePath);
                        }
                    });
                }
                postData.page_image = ''; 
            } else {
               
                if (!req.file) {
                    postData.page_image = oldImagePath; 
                
                } else if (oldImagePath) {
                    fs.unlink(oldImagePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('기존 파일 삭제 오류:', unlinkErr);
                        } else {
                            console.log('기존 파일 삭제 완료:', oldImagePath);
                        }
                    });
                }
            }
            const updateResult = await Post.updatePost(post_id, {
                page_title: postData.postTitle,
                page_content: postData.postContent,
                page_image: postData.page_image,
            });

            if (updateResult.affectedRows === 0) {
                return res.status(500).json({ success: false, message: '게시글 수정 실패' });
            }
    
            res.status(200).json({ success: true, message: '게시글 수정 완료' });
    

        } catch (error) {
           console.error(error);
            res.status(500).json({ success: false, message: '서버 오류' });
        }
         
    },


    // likesUpdate: async (req,res)=>{
    //     const {post_id} = req.params;
    //     fs.readFile(postsFilePath,'utf-8',(err,data)=>{
    //         if(err){
    //             console.error('파일 읽기 오류: ',err);
    //             return res.status(500).json({success: false, message: '서버 오류'});
    //             }
    //         const posts= JSON.parse(data);

    //         const post = posts.find(p=> p.post_id=== Number(post_id));
      
    //         post.likes_count += 1;

    //     fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
    //         if (err) {
    //             console.error('파일 쓰기 오류:', err);
    //             return res.status(500).json({success: false, message: '서버 오류' });
    //         }

            
    //         res.status(200).json({ success: true, message: '좋아요 업데이트 완료' });
    //     });
                                 
    //     });
    // },

    updateLikes: async (req,res)=>{
        const {post_id,user_id} = req.params;

        try{
        const post = await Post.getPosts(post_id);
            
            if (!post) {
                return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
            }

            const result = await Post.updateLikes(post_id,user_id);

            if (!result.success) {
                return res.status(500).json({ success: false, message: '게시글 수정 실패' });
            }
            
            res.status(200).json({ success: true, message: '좋아요 업데이트 완료' });
        } catch(error){
            console.error(error);
        }
    },
    likesStatus: async(req,res)=>{
        const {post_id} = req.params;
        const user_id =req.session.user.user_id;
        const userId = String(user_id);
        try{
            const result = await Post.likesStatus(post_id,user_id);

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: '게시물이 존재하지 않습니다.' });
            }

            const liked_by_user = result[0].liked_by_user ? JSON.parse(result[0].liked_by_user) : [];
            
            const isLiked = liked_by_user.includes(userId);
        
            res.status(200).json({ success: true, isLiked });
        } catch(error){
            console.error(error);
        }
    },

    // commentCountUpdate:async(req,res)=>{
    //     const {post_id} = req.params;
    //     fs.readFile(postsFilePath,'utf-8',(err,data)=>{
    //         if(err){
    //             console.error('파일 읽기 오류: ',err);
    //             return res.status(500).json({success: false, message: '서버 오류'});
    //             }
    //         const posts= JSON.parse(data);

    //         const post = posts.find(p=> p.post_id=== Number(post_id));
      
    //         post.comment_count += 1;

    //     fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
    //         if (err) {
    //             console.error('파일 쓰기 오류:', err);
    //             return res.status(500).json({success: false, message: '서버 오류' });
    //         }

            
    //         res.status(200).json({ success: true, message: '댓글수 업데이트 완료' });
    //          });
    //      });
    // },

    // deleteUserPosts: async(req,res)=>{
    //     const {user_id}=req.params;

    //     console.log("user",user_id);
    //     fs.readFile(postsFilePath,'utf-8',(err,data)=>{
    //         if(err){
    //             console.error('파일 읽기 오류: ',err);
    //             return res.status(500).json({success: false, message: '서버 오류'});
    //         }
    //         const posts= JSON.parse(data);

    //         const post = posts.filter(p=> !(p.user_id=== Number(user_id)));
            
    //         console.log("post",post);
    //         fs.writeFile(postsFilePath, JSON.stringify(post, null, 2), (err) => {
    //             if (err) {
    //                 console.error('파일 쓰기 오류:', err);
    //                 return res.status(500).json({success: false, message: '서버 오류' });
    //             }

                
    //             res.status(200).json({ success: true, message: '모든 게시글 삭제 완료' });
    //         });
    //     });
    // },
    deleteUserPosts: async(req,res)=>{
        const {user_id}=req.params;

        try{
            const result = await Post.deleteAllPosts(user_id);
    
            if(!result){
                return res.status(400).json({success:false,message: '게시글이 존재하지 않습니다.'});
            }
            
            res.status(201).json({success: true, message: '모든 게시글 삭제 완료'});   
            } catch(error){
                console.error(error);
            }    

       
    },

}

export default postController;