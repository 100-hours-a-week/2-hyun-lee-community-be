import Comment from '../models/comment.js';
import commentService from '../services/commentService.js';
const commentController = {
  createComment: async (req, res, next) => {
    try {
      const results = await commentService.createComment(req);

      return res.status(201).json({
        success: true,
        comment: results,
        message: '댓글 작성 완료',
      });
    } catch (error) {
      next(error);
    }
  },

  getAllComments: async (req, res, next) => {
    try {
      const {user_id, comments} = await commentService.getAllComments(req);
      return res.status(200).json({
        success: true,
        comments,
        user_id: user_id,
      });
    } catch (error) {
        next(error);
    }
  },

  getComment: async (req, res, next) => {
    try {
      const {user_id, comments} = await commentService.getComment(req);
      
      return res.status(200).json({
        success: true,
        comments,
        user_id: user_id,
      });
    } catch (error) {
        next(error);
    }
  },

  deleteComment: async (req, res, next) => {
    
    try {
      await commentService.deleteComment(req);
      return res.status(200).json({
        success: true,
        message: '댓글 삭제 완료',
      });
    } catch (error) {
        next(error);
    }
  },

  updateComment: async (req, res, next) => {

    try {
      const comments = await commentService.updateComment(req);
      return res.status(200).json({
        comments,
        success: true,
        message: '댓글 수정 완료',
      });
    } catch (error) {
        next(error);
    }
  },

  deleteUserComments: async (req, res, next) => {
    
    try {
      await commentService.deleteUserComments(req);

      return res.status(200).json({
        success: true,
        message: '모든 댓글 삭제 완료',
      });
    } catch (error) {
        next(error);
    }
  },
};

export default commentController;
