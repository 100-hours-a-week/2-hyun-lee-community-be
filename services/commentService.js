import Comment from '../models/comment.js';
import AppError from '../utils/AppError.js';


const createComment = async(req) =>{
    const user = req.session.user;
    const { post_id } = req.params;

    if (!post_id || isNaN(post_id)) {
        throw new AppError('유효하지 않은 게시글 ID입니다.', 400);
      }
    if (!req.body.content || typeof req.body.content !== 'string' || req.body.content.trim() === '') {
        throw new AppError('유효하지 않은 댓글 내용입니다.', 400);
    }
    const id = Number(post_id);
    const commentData = {
      post_id: id,
      content: req.body.content,
      user_id: user.user_id,
    };
    
    const results = await Comment.createComment(commentData);

    return results;
}

const getAllComments = async(req) =>{
    const { post_id } = req.params;
    if (!post_id || isNaN(post_id)) {
        throw new AppError('유효하지 않은 게시글 ID입니다.', 400);
      }
    const user_id = req.session.user.user_id;

    const comments = await Comment.getAllComments(post_id);
    
    return {user_id, comments};
}

const getComment = async(req) =>{
    const { comment_id } = req.params;

    if (!comment_id || isNaN(comment_id)) {
        throw new AppError('유효하지 않은 댓글 ID입니다.', 400);
    }
    const user_id = req.session.user.user_id;

    const comments = await Comment.getComment(comment_id);
    
    return {user_id, comments};
}

const deleteComment = async(req) =>{
    const { post_id, comment_id } = req.params;

    if (!post_id || isNaN(post_id)) {
        throw new AppError('유효하지 않은 게시글 ID입니다.', 400);
    }
  
    if (!comment_id || isNaN(comment_id)) {
        throw new AppError('유효하지 않은 댓글 ID입니다.', 400);
    }
   
    await Comment.deleteComment(post_id, comment_id);
}

const updateComment = async(req) =>{
    const { post_id, comment_id } = req.params;
    const newContent = req.body.content;

    if (!post_id || isNaN(post_id)) {
        throw new AppError('유효하지 않은 게시글 ID입니다.', 400);
    }
  
    if (!comment_id || isNaN(comment_id)) {
    throw new AppError('유효하지 않은 댓글 ID입니다.', 400);

    }

    if (!newContent || typeof newContent !== 'string' || newContent.trim() === '') {
        throw new AppError('유효하지 않은 요청입니다. content 필드를 확인하세요.', 400);
    }

    await Comment.updateComment(post_id, comment_id, newContent);
    const comments = await Comment.getComment(comment_id);

    return comments;
}

const deleteUserComments = async(req) =>{
    const { user_id } = req.params;

    if (!user_id || isNaN(user_id)) {
        throw new AppError('유효하지 않은 사용자 ID입니다.', 400);
      }
    const result = await Comment.deleteAllComments(user_id);

    if (!result) {
        throw new AppError('댓글이 존재하지 않습니다.', 400);
    }

}

export default{
    createComment,
    getAllComments,
    getComment,
    deleteComment,
    updateComment,
    deleteUserComments
}