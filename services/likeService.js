import Like from '../models/like.js'; 
import Post from '../models/post.js';
import AppError from '../utils/AppError.js';


const updateLikes = async(req) => {
    const { post_id, user_id } = req.params;

    const post = await Post.getPosts(post_id);

      if (!post || post.length === 0) {
        throw new AppError('유효하지 않은 게시글 입니다.', 400);
      }

      const result = await Like.updateLikes(post_id, user_id);

      if (!result.success) {
        throw new AppError('좋아요 업데이트 실패', 500);
      }


      return result;
}

const userLikesStatus = async(req) => {
    const { post_id } = req.params;
    const user_id = req.session.user.user_id;

    const result = await Like.userLikesStatus(post_id, user_id);

    return result[0];
}

export default{
    updateLikes,
    userLikesStatus
}