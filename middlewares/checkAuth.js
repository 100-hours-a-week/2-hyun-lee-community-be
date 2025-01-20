import Post from '../models/post.js'; 
import Comment from '../models/comment.js';


export function checkAuth(req,res,next){
    if(!req.session.user){
        return res.status(401).json({ success:false, message: "인증이 필요합니다."});
    }
    next();
}

export function checkOwnershipParam(req, res, next) {
    const loginUserId = req.session.user.user_id;
    const {user_id}=req.params;
    const paramUserId= Number(user_id);
  if (loginUserId !== paramUserId) {
    return res.status(403).json({ success:false, message: '권한이 없습니다.' });
  }
  next();
}

export function checkOwnershipBody(req, res, next) {
    const loginUserId = req.session.user.user_id;
    const bodyUserId = req.body.user_id;
    if (loginUserId !== Number(bodyUserId)) {
      return res.status(403).json({ success:false, message: '권한이 없습니다.' });
    }
    next();
  }

  export async function checkPostOwnership(req, res, next) {
    try {
      const loginUserId = req.session.user.user_id;
      const { post_id } = req.params;
  
      
      const post = await Post.getPosts(post_id); 
      if (!post) {
        return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
      }
  
      if (post[0].user_id !== loginUserId) {
        return res.status(403).json({ success: false, message: '권한이 없습니다.' });
      }
  
      next();
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: '서버 오류' });
    }
  }
  
  export async function checkCommentOwnership(req, res, next) {
    try {
      const loginUserId = req.session.user.user_id;
      const { comment_id } = req.params;
  
      
      const comments = await Comment.getComment(comment_id);
      if (!comments) {
        return res.status(404).json({ success: false, message: '댓글을 찾을 수 없습니다.' });
      }
  
      if (comments[0].user_id !== loginUserId) {
        return res.status(403).json({ success: false, message: '권한이 없습니다.' });
      }
  
      next();
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: '서버 오류' });
    }
  }