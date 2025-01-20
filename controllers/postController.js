import Post from '../models/post.js'; 
import Comment from '../models/comment.js';
import AWS from 'aws-sdk';

const CDN_URL = 'https://d2m8tt5bgy55i.cloudfront.net/';
const S3_URL = 'https://s3.ap-northeast-2.amazonaws.com/hyun.lee.bucket/';

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const postController = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.getAllPosts();
      return res.status(200).json({
        success: true,
        posts,
        message: "모든 게시글 조회 성공",
      });
    } catch (error) {
      console.error('Error in getAllPosts:', error);
      return res.status(500).json({
        success: false,
        message: '게시글 조회 실패',
      });
    }
  },

  createPost: async (req, res) => {
    const user = req.session.user;
    const { postTitle, postContent } = req.body;

    if (!postTitle || !postContent) {
        return res.status(400).json({
          success: false,
          message: '제목 또는 내용을 입력하세요.',
        });
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
    try {
      const result = await Post.create(postData);
      return res.status(201).json({
        post: result[0],
        success: true,
        message: '게시글 작성 완료',
      });
    } catch (error) {
      console.error('Error in createPost:', error);
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
  },

  getPosts: async (req, res) => {
    const { post_id } = req.params;

    if (!post_id || isNaN(post_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 게시글 ID입니다.',
        });
      }

    const user_id = req.session.user.user_id;
    try {
      const posts = await Post.getPosts(post_id);
      if (!posts || posts.length === 0) {
        return res.status(404).json({
          success: false,
          message: '게시글이 존재하지 않습니다.',
        });
      }
      return res.status(200).json({
        success: true,
        posts,
        user_id,
        message: '게시글 조회 성공',
      });
    } catch (error) {
      console.error('Error in getPosts:', error);
      return res.status(500).json({
        success: false,
        message: '게시글 조회 실패',
      });
    }
  },

  updateViews: async (req, res) => {
    const { post_id } = req.params;

    if (!post_id || isNaN(post_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 게시글 ID입니다.',
        });
      }
    try {
      await Post.updateViews(post_id);
      return res.status(200).json({
        success: true,
        message: '조회수 업데이트 성공',
      });
    } catch (error) {
      console.error('Error in updateViews:', error);
      return res.status(500).json({
        success: false,
        message: '조회수 업데이트 실패',
      });
    }
  },

  deletePost: async (req, res) => {
    const { post_id } = req.params;

    if (!post_id || isNaN(post_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 게시글 ID입니다.',
        });
      }

    const user_id = req.session.user.user_id;
    try {
      const post = await Post.getPosts(post_id);
      const image = post[0].post_image;
      if (!post || post.length === 0) {
        return res.status(404).json({
          success: false,
          message: '게시글이 존재하지 않습니다.',
        });
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
      return res.status(200).json({
        success: true,
        message: '게시글 삭제 성공',
        image,
      });
    } catch (error) {
      console.error('Error in deletePost:', error);
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
  },

  updatePost: async (req, res) => {
    const { post_id } = req.params;
    const { postTitle, postContent, postDelete } = req.body;
    if (!post_id || isNaN(post_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 게시글 ID입니다.',
        });
      }
  
      if (!postTitle || !postContent) {
        return res.status(400).json({
          success: false,
          message: '제목 또는 내용을 입력하세요.',
        });
      }
    const postData = {
      postTitle,
      postContent,
      post_image: req.file
        ? decodeURIComponent(req.file.location.replace(S3_URL, CDN_URL))
        : '',
      postDelete: req.body.postDelete === 'true',
    };
    try {
      const post = await Post.getPosts(post_id);

      if (!post || post.length === 0) {
        return res.status(404).json({
          success: false,
          message: '게시글을 찾을 수 없습니다.',
        });
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
        return res
          .status(500)
          .json({ success: false, message: '게시글 수정 실패' });
      }
      return res.status(200).json({ success: true, message: '게시글 수정 완료' });
    } catch (error) {
      console.error('Error in updatePost:', error);
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
  },

  deleteUserPosts: async (req, res) => {
    const { user_id } = req.params;
    
    if (!user_id || isNaN(user_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 사용자 ID입니다.',
        });
      }
    try {
      const posts = await Post.getAllPostsByUserId(user_id);
      if (!posts || posts.length === 0) {
        return res.status(404).json({
          success: false,
          message: '게시글이 존재하지 않습니다.',
        });
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

      return res.status(200).json({
        success: true,
        message: '모든 게시글 삭제 완료',
      });
    } catch (error) {
      console.error('Error in deleteUserPosts:', error);
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
  },
};

export default postController;
