import Like from '../models/like.js'; 
import Post from '../models/post.js';
import likeService from '../services/likeService.js';

const likeController = {
  updateLikes: async (req, res) => {
    try {
      const result = await likeService.updateLikes(req);

      return res.status(200).json({
        success: true,
        message: '좋아요 업데이트 완료',
        result: result,
      });
    } catch (error) {
      next(error);
    }
  },

  userLikesStatus: async (req, res, next) => {
    try {
      const result = await likeService.userLikesStatus(req);
      return res.status(200).json({
        success: true,
        result: result,
      });
    } catch (error) {
        next(error);
    }
  },
};

export default likeController;
