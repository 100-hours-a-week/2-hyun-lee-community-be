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

    getPosts: async (req, res) => {
        console.log(req)
        try {
            const board_id=req.query.board_id;
            const posts = await Post.getPosts(board_id);
            res.status(200).json(posts);
        } catch (error) {
            console.error('게시글 조회 중 오류:', error);
            res.status(500).json({ message: '게시글 조회 실패' });
        }
    }
};

module.exports=postController;