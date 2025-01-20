import Comment from '../models/comment.js';

const commentController = {
  createComment: async (req, res) => {
    const user = req.session.user;
    const { post_id } = req.params;

    if (!post_id || isNaN(post_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 게시글 ID입니다.',
        });
      }
    if (!req.body.content || typeof req.body.content !== 'string' || req.body.content.trim() === '') {
    return res.status(400).json({
        success: false,
        message: '유효하지 않은 댓글 내용입니다.',
    });
    }
    const id = Number(post_id);
    const commentData = {
      post_id: id,
      content: req.body.content,
      user_id: user.user_id,
    };

    try {
      const results = await Comment.createComment(commentData);

      return res.status(201).json({
        success: true,
        comment: results,
        message: '댓글 작성 완료',
      });
    } catch (error) {
      console.error('Error in createComment:', error);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  },

  getAllComments: async (req, res) => {
    const { post_id } = req.params;
    if (!post_id || isNaN(post_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 게시글 ID입니다.',
        });
      }
    const user_id = req.session.user.user_id;

    try {
      const comments = await Comment.getAllComments(post_id);
      return res.status(200).json({
        success: true,
        comments,
        user_id: user_id,
      });
    } catch (error) {
      console.error('Error in getAllComments:', error);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  },

  getComment: async (req, res) => {
    const { comment_id } = req.params;

    if (!comment_id || isNaN(comment_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 댓글 ID입니다.',
        });
      }
    const user_id = req.session.user.user_id;

    try {
      const comments = await Comment.getComment(comment_id);
      return res.status(200).json({
        success: true,
        comments,
        user_id: user_id,
      });
    } catch (error) {
      console.error('Error in getComment:', error);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  },

  deleteComment: async (req, res) => {
    const { post_id, comment_id } = req.params;

    if (!post_id || isNaN(post_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 게시글 ID입니다.',
        });
      }
  
      if (!comment_id || isNaN(comment_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 댓글 ID입니다.',
        });
      }
    try {
      const result = await Comment.deleteComment(post_id, comment_id);
      return res.status(200).json({
        success: true,
        message: '댓글 삭제 완료',
      });
    } catch (error) {
      console.error('Error in deleteComment:', error);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  },

  updateComment: async (req, res) => {
    const { post_id, comment_id } = req.params;
    const newContent = req.body.content;

    if (!post_id || isNaN(post_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 게시글 ID입니다.',
        });
      }
  
      if (!comment_id || isNaN(comment_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 댓글 ID입니다.',
        });
      }

    if (!newContent || typeof newContent !== 'string' || newContent.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 요청입니다. content 필드를 확인하세요.',
      });
    }

    try {
      await Comment.updateComment(post_id, comment_id, newContent);
      const comments = await Comment.getComment(comment_id);

      return res.status(200).json({
        comments,
        success: true,
        message: '댓글 수정 완료',
      });
    } catch (error) {
      console.error('Error in updateComment:', error);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  },

  deleteUserComments: async (req, res) => {
    const { user_id } = req.params;

    if (!user_id || isNaN(user_id)) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 사용자 ID입니다.',
        });
      }
    try {
      const result = await Comment.deleteAllComments(user_id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: '댓글이 존재하지 않습니다.',
        });
      }

      return res.status(200).json({
        success: true,
        message: '모든 댓글 삭제 완료',
      });
    } catch (error) {
      console.error('Error in deleteUserComments:', error);
      return res.status(500).json({
        success: false,
        message: '서버 오류',
      });
    }
  },
};

export default commentController;
