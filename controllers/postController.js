const Post = require('../models/post'); // 게시글 모델 임포트
const { post } = require('../routes/userRoutes');

const postController={
    createPost: async(req,res)=>{
        const user=req.session.user;
        const postData ={
            postTitle:req.body.postTitle,
            postContent: req.body.postContent,
            userId:user.userId,
            userNickname:user.nickname,
            postImage: req.file ? req.file.path : null
        };
        console.log('post',postData);
        try{
            const result= await Post.create(postData);
            console.log('result',result);
            return res.status(201).json({
                message:'게시글 작성 완료'
            });
        }catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ message: '서버 오류' });
        }
    },
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.getAllPosts();
            res.status(200).json(posts);
        } catch (error) {
            console.error('게시글 조회 중 오류:', error);
            res.status(500).json({ message: '게시글 조회 실패' });
        }
    },

    getPosts: async (board_id, res) => {
        try {
            const posts = await Post.getPosts(board_id);
            //console.log(posts);
            res.status(200).json(posts);
        } catch (error) {
            console.error('게시글 조회 중 오류:', error);
            res.status(500).json({ message: '게시글 조회 실패' });
        }
    },
    deletePost: async(req,res)=>{
        try{
            
            const {board_id}=req.query;
            const user=req.session.user;
            const post = await Post.getPosts(board_id);
            if (!post) {
                return res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
            }

            if (post[0][0].user_id !== user.userId) {
                return res.status(403).json({ success: false, message: '삭제 권한이 없습니다.' });
            }
    
            const result=await Post.deletePost(board_id);
            if (result) {
                return res.status(200).json({ success: true, message: '게시글이 삭제되었습니다.' });
            } else {
                return res.status(500).json({ success: false, message: '게시글 삭제에 실패했습니다.' });
            }
        }
        catch(error){
            console.error('게시글 삭제 중 오류:', error);
            res.status(500).json({ success: false,message: '서버 오류' });
    
        }
    }
};

module.exports=postController;