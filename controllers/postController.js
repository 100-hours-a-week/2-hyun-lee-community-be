import postService from "../services/postService.js";


const postController = {
  getAllPosts: async (req, res, next) => {
    try {
      const posts = await postService.getAllPost(req); 
      return res.status(200).json({
        success: true,
        posts,
        message: "모든 게시글 조회 성공",
      });
    } catch (error) {
        next(error);
    }
  },

  createPost: async (req, res, next) => {
   
    try {
      const result = await postService.createPost(req);
      return res.status(201).json({
        post: result,
        success: true,
        message: '게시글 작성 완료',
      });
    } catch (error) {
        next(error);
    }
  },

  getPosts: async (req, res, next) => {
    try {
      const { posts, user_id } = await postService.getPosts(req);
    
      return res.status(200).json({
        success: true,
        posts,
        user_id,
        message: '게시글 조회 성공',
      });
    } catch (error) {
        next(error);
    }
  },

  updateViews: async (req, res, next) => {
    try {
      await postService.updateViews(req);
      return res.status(200).json({
        success: true,
        message: '조회수 업데이트 성공',
      });
    } catch (error) {
        next(error);
    }
  },

  deletePost: async (req, res, next) => {

    try {
      const image = await postService.deletePost(req);
     
      return res.status(200).json({
        success: true,
        message: '게시글 삭제 성공',
        image,
      });
    } catch (error) {
        next(error);
    }
  },

  updatePost: async (req, res, next) => {
    try {
      await postService.updatePost(req);

      return res.status(200).json({ success: true, message: '게시글 수정 완료' });
    } catch (error) {
        next(error);
    }
  },

  deleteUserPosts: async (req, res, next) => {
    try {
      await postService.deleteUserPosts(req);

      return res.status(200).json({
        success: true,
        message: '모든 게시글 삭제 완료',
      });
      
    } catch (error) {
        next(error);
    }
  },
};

export default postController;
