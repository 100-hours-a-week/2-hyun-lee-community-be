import Comment from '../models/comment.js';



const commentController ={
    
    createComment:async(req,res)=>{
        const user= req.session.user;
        const {post_id} = req.params;
        const id = Number(post_id);
        const commentData={
                post_id:id,
                content:req.body.content,
                user_id:user.user_id,
                }
        try{
        const results = await Comment.createComment(commentData);    
        
        res.status(201).json({success: true, comment:results,message: '댓글 작성완료'});
                
            
        } catch(error){
            return res.status(500).json({success: false,message :'서버 오류'});
        }
    },
    getAllComments: async(req,res)=>{
        const {post_id} = req.params;
        const user_id = req.session.user.user_id;

        try{
            const comments = await Comment.getAllComments(post_id);
            res.status(200).json({success : true, comments, user_id:user_id});
        } catch (error){
            console.error(error);
            return res.status(500).json({success: false,message :'서버 오류'});
            
        }
     },
     getComment: async(req,res)=>{
        const {comment_id} = req.params;
        const user_id = req.session.user.user_id;
        try{
            const comments = await Comment.getComment(comment_id);
            res.status(200).json({success : true, comments, user_id:user_id});
        } catch (error){
            console.error(error);
            return res.status(500).json({success: false,message :'서버 오류'});
            
        }

     },
    deleteComment:async(req,res)=>{
        const {post_id,comment_id}=req.params;
        try{
        const result = await Comment.deleteComment(post_id,comment_id);
        res.status(201).json({success: true, message: '댓글 삭제완료'});  
        } catch(error){
            console.error(error);
            return res.status(500).json({success: false,message :'서버 오류'});
        }
        
        

    },

    updateComment : async (req,res)=>{
        const {post_id,comment_id}=req.params;
        const newContent=req.body.content;

        try{
            await Comment.updateComment(post_id,comment_id,newContent);
            const comments = await Comment.getComment(comment_id);
            res.status(201).json({comments,success: true, message: '댓글 수정완료'});
        } catch(error){
            console.error(error);
            return res.status(500).json({success: false,message :'서버 오류'});
        }
                   
            
    },
    deleteUserComments:async(req,res)=>{
        const {user_id}=req.params;

        try{
        const result = await Comment.deleteAllComments(user_id);

        if(!result){
            return res.status(400).json({success:false,message: '댓글이 존재하지 않습니다.'});
        }
        
        res.status(201).json({success: true, message: '모든 댓글 삭제 완료'});   
        } catch(error){
            console.error(error);
        }    
    },

}

export default commentController;