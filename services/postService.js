import Post from '../models/post.js'; 
import s3 from '../utils/awsS3.js';
import AppError from '../utils/AppError.js';
import Comment from '../models/comment.js';

const CDN_URL = 'https://d2m8tt5bgy55i.cloudfront.net/';
const S3_URL = 'https://s3.ap-northeast-2.amazonaws.com/hyun.lee.bucket/';


const getAllPost = async(req) => {
    const posts = await Post.getAllPosts();

    return posts;
    
}

const createPost = async(req) => { 
    const user = req.session.user;
    const { postTitle, postContent } = req.body;

    if (!postTitle || !postContent) {
        throw new AppError('제목 또는 내용을 입력하세요.', 400);
    }
    const postData = {
      postTitle,
      postContent,
      userId: user.user_id,
      userNickname: user.nickname,
      post_image: req.file
        ? decodeURIComponent(req.file.location.replace(S3_URL, CDN_URL))
        : '',
    };
      const result = await Post.create(postData);
      return result[0];
}

const getPosts = async(req) => {
    const { post_id } = req.params;

    if (!post_id || isNaN(post_id)) {
        throw new AppError('유효하지 않은 게시글 ID입니다.', 400);

    }

    const user_id = req.session.user.user_id;
      const posts = await Post.getPosts(post_id);
      if (!posts || posts.length === 0) {
        throw new AppError('게시글이 존재하지 않습니다.', 404);
      }
      return { posts:posts, user_id:user_id };
}

const updateViews = async(req) => {
    const { post_id } = req.params;

    if (!post_id || isNaN(post_id)) {
        throw new AppError('유효하지 않은 게시글 ID입니다.', 400);
    }
    
    await Post.updateViews(post_id);
}

const deletePost = async(req) =>{
    const { post_id } = req.params;

    if (!post_id || isNaN(post_id)) {
        throw new AppError('유효하지 않은 게시글 ID입니다.', 400);
      }

    const user_id = req.session.user.user_id;
      const post = await Post.getPosts(post_id);
      const image = post[0].post_image;

      if (!post || post.length === 0) {
        throw new AppError('게시글이 존재하지 않습니다.', 404);
      }
      if (image !== "") {
        const delete_image = image.replace(CDN_URL, S3_URL);
        s3.deleteObject({
          Bucket: 'hyun.lee.bucket',
          Key: decodeURIComponent(
            delete_image.split('amazonaws.com/hyun.lee.bucket/')[1]
          ),
        }, (err, data) => {
          if (err) { throw err; }
          console.log('기존 이미지 삭제 성공:', delete_image);
        });
      }
      await Comment.deleteAllComments(user_id);
      await Post.deletePost(post_id);
      return image;
    
}

const updatePost = async(req) =>{
    const { post_id } = req.params;
    const { postTitle, postContent } = req.body;
    if (!post_id || isNaN(post_id)) {
        throw new AppError('유효하지 않은 게시글 ID입니다.', 400);
      }
  
      if (!postTitle || !postContent) {
        throw new AppError('제목 또는 내용을 입력하세요.', 400);
      }
    const postData = {
      postTitle,
      postContent,
      post_image: req.file
        ? decodeURIComponent(req.file.location.replace(S3_URL, CDN_URL))
        : '',
      postDelete: req.body.postDelete === 'true',
    };
      const post = await Post.getPosts(post_id);

      if (!post || post.length === 0) {
        throw new AppError('게시글이 존재하지 않습니다.', 404);
      }

      const oldImagePath = post[0].post_image.replace(CDN_URL, S3_URL);
      if (postData.postDelete) {
        if (oldImagePath) {
          s3.deleteObject({
            Bucket: 'hyun.lee.bucket',
            Key: decodeURIComponent(
              oldImagePath.split('amazonaws.com/hyun.lee.bucket/')[1]
            ),
          }, (err, data) => {
            if (err) { throw err; }
            console.log('기존 이미지 삭제 성공:', oldImagePath);
          });
        }
        postData.post_image = '';
      } else {
        if (!req.file) {
          postData.post_image = oldImagePath;
        } else if (oldImagePath) {
          s3.deleteObject({
            Bucket: 'hyun.lee.bucket',
            Key: decodeURIComponent(
              oldImagePath.split('amazonaws.com/hyun.lee.bucket/')[1]
            ),
          }, (err, data) => {
            if (err) { throw err; }
            console.log('기존 이미지 삭제 성공:', oldImagePath);
          });
        }
      }
      const updateResult = await Post.updatePost(post_id, {
        post_title: postData.postTitle,
        post_content: postData.postContent,
        post_image: postData.post_image,
      });

      if (updateResult.affectedRows === 0) {
        throw new AppError('게시글 수정 실패', 500);
      }
}

const deleteUserPosts = async(req) => {
    const { user_id } = req.params;
    
    if (!user_id || isNaN(user_id)) {
        throw new AppError('유효하지 않은 사용자 ID입니다.', 400);
    }
      const posts = await Post.getAllPostsByUserId(user_id);
      if (!posts || posts.length === 0) {
        return "게시글이 존재하지않습니다.";
      }
      const deleteImagePromises = posts.map((post) => {
        if (post.page_image !== "") {
          const delete_image = post.post_image.replace(CDN_URL, S3_URL);
          const key = decodeURIComponent(
            delete_image.split('amazonaws.com/hyun.lee.bucket/')[1]
          );
          return new Promise((resolve, reject) => {
            s3.deleteObject({ Bucket: 'hyun.lee.bucket', Key: key }, (err, data) => {
              if (err) {
                console.error('이미지 삭제 실패', err);
                return reject(err);
              }
              console.log('기존 이미지 삭제 성공:', delete_image);
              resolve(data);
            });
          });
        }
        return Promise.resolve();
      });
      await Promise.all(deleteImagePromises);

      await Post.deleteAllPosts(user_id);
      
}
export default{
    getAllPost,
    createPost,
    getPosts,
    updateViews,
    deletePost,
    updatePost,
    deleteUserPosts
} 