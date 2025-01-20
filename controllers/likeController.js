import Like from '../models/like.js'; 
import Post from '../models/post.js';

const likeController = {
  updateLikes: async (req, res) => {
    const { post_id, user_id } = req.params;

    try {
      const post = await Post.getPosts(post_id);

      if (!post || post.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: '게시글을 찾을 수 없습니다.' });
      }

      const result = await Like.updateLikes(post_id, user_id);

      if (!result.success) {
        return res
          .status(500)
          .json({ success: false, message: '좋아요 업데이트 실패' });
      }

      return res.status(200).json({
        success: true,
        message: '좋아요 업데이트 완료',
        result: result,
      });
    } catch (error) {
      console.error('Error in updateLikes:', error);
      return res
        .status(500)
        .json({ success: false, message: '서버 오류' });
    }
  },

  userLikesStatus: async (req, res) => {
    const { post_id } = req.params;
    const user_id = req.session.user.user_id;
    const userId = String(user_id);

    try {
      const result = await Like.userLikesStatus(post_id, user_id);

      return res.status(200).json({
        success: true,
        result: result[0],
      });
    } catch (error) {
      console.error('Error in userLikesStatus:', error);
      return res
        .status(500)
        .json({ success: false, message: '서버 오류' });
    }
  },
};

export default likeController;
