import Post from '../models/post.js'; 
import Comment from '../models/comment.js';
import AWS from 'aws-sdk';
import { resolve } from 'path';


const CDN_URL = 'https://d2m8tt5bgy55i.cloudfront.net/';
const S3_URL = 'https://s3.ap-northeast-2.amazonaws.com/hyun.lee.bucket/';
 

AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });
  
const s3 = new AWS.S3();


const postController ={
    
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
    createPost: async(req,res)=>{
        const user = req.session.user;
        const postData ={
            postTitle:req.body.postTitle,
            postContent: req.body.postContent,
            userId:user.user_id,
            userNickname:user.nickname,
            page_image: req.file ? decodeURIComponent(req.file.location.replace(S3_URL,CDN_URL)) : '',
        };
        try{
            const result= await Post.create(postData);
            return res.status(201).json({success: true,message:'게시글 작성 완료'});
        }catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: '서버 오류' });
        }
    },
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
    
    deletePost: async(req,res)=>{
       const{post_id} = req.params;
       const user_id = req.session.user.user_id;
       try {
        const post = await Post.getPosts(post_id);
        const image = post[0].page_image;
        if(image !==""){
            const delete_image =image.replace(CDN_URL,S3_URL);
            s3.deleteObject({
                Bucket: 'hyun.lee.bucket',
                Key: decodeURIComponent(delete_image.split('amazonaws.com/hyun.lee.bucket/')[1]),
              },(err, data) => {
                if (err) { throw err;} 
                console.log('기존 이미지 삭제 성공:',delete_image);
            });
        }
        await Comment.deleteAllComments(user_id);
        await Post.deletePost(post_id);
        res.status(200).json({image,success:true, message:"게시글 삭제 성공"});
        } catch (error) {
        console.error(error);
        res.status(500).json({ success:false,message: '서버 오류' });
    }
        
    },
    updatePost:async(req,res)=>{
        const {post_id}=req.params;
        const  postData ={
            postTitle:req.body.postTitle,
            postContent: req.body.postContent,
            page_image: req.file ? decodeURIComponent(req.file.location.replace(S3_URL,CDN_URL)) : '',
            postDelete: req.body.postDelete === 'true', 
        }
        try{
            const post = await Post.getPosts(post_id);
            
            if (!post) {
                return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
            }

        
            const oldImagePath = post[0].page_image.replace(CDN_URL,S3_URL);        
            if (postData.postDelete) {
                 if(oldImagePath){
                        s3.deleteObject({
                        Bucket: 'hyun.lee.bucket',
                        Key: decodeURIComponent(oldImagePath.split('amazonaws.com/hyun.lee.bucket/')[1]),
                      },(err, data) => {
                        if (err) { throw err;} 
                        console.log('기존 이미지 삭제 성공:',oldImagePath);
                    })
            }
            
            // if (postData.postDelete) {
            
            //     if (oldImagePath) {
            //         fs.unlink(oldImagePath, (err) => {
            //             if (err) {
            //                 console.error('기존 이미지 삭제 오류:', err);
            //             } else {
            //                 console.log('기존 이미지 삭제 성공:', oldImagePath);
            //             }
            //         });
            //     }
                    
                postData.page_image = ''; 
            } else {
               
                if (!req.file) {
                    postData.page_image = oldImagePath; 
                
                } else if (oldImagePath) {
                        s3.deleteObject({
                            Bucket: 'hyun.lee.bucket',
                            Key: decodeURIComponent(oldImagePath.split('amazonaws.com/hyun.lee.bucket/')[1]),
                          },(err, data) => {
                            if (err) { throw err;} 
                            console.log('기존 이미지 삭제 성공:',oldImagePath);
                        })
                    };
                    
                    
                    // fs.unlink(oldImagePath, (unlinkErr) => {
                    //     if (unlinkErr) {
                    //         console.error('기존 파일 삭제 오류:', unlinkErr);
                    //     } else {
                    //         console.log('기존 파일 삭제 완료:', oldImagePath);
                    //     }
                    // });
                }
            const updateResult = await Post.updatePost(post_id, {
                post_title: postData.postTitle,
                post_content: postData.postContent,
                page_image: postData.page_image,
            });

            if (updateResult.affectedRows === 0) {
                return res.status(500).json({ success: false, message: '게시글 수정 실패' });
            }
    
          
            res.status(200).json({success: true, message: '게시글 수ㅇ정 완료' });
    

        } catch (error) {
           console.error(error);
            res.status(500).json({ success: false, message: '서버 오류' });
        }
         
    },

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
    deleteUserPosts: async(req,res)=>{
        const {user_id}=req.params;

        try{
            const posts = await Post.getAllPostsByUserId(user_id);
    
            if(!posts){
                return res.status(400).json({success:false,message: '게시글이 존재하지 않습니다.'});
            }
            const deleteImagePromises = posts.map(post=>{
                if(post.page_image !==""){
                    const delete_image =post.page_image.replace(CDN_URL,S3_URL);
                    const key = decodeURIComponent(delete_image.split('amazonaws.com/hyun.lee.bucket/')[1]);
                    return new Promise ((resolve,reject)=>{
                        s3.deleteObject({
                            Bucket: 'hyun.lee.bucket',
                            Key: key,
                          },(err, data) => {
                            if (err) { 
                                console.error('이미지 삭제 실패',err);
                                return reject(err);
                            } 
                            console.log('기존 이미지 삭제 성공:',delete_image);
                            resolve(data);
                        });
                    })  
                }
                return Promise.resolve();
            })
            await Promise.all(deleteImagePromises);
            
            await Post.deleteAllPosts(user_id);
            
            res.status(201).json({success: true, message: '모든 게시글 삭제 완료'});   
            } catch(error){
                console.error(error);
            }    

       
    },

}

export default postController;