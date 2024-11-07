const db=require('../config/db');

const Post = {
    create: (postData)=>{
        const query='INSERT INTO board(page_title,page_content,create_at,user_fk,likes_count, view_count,page_image,comment_count) VALUES (?,?,NOW(),?,0,0,?,0)';
        return new Promise((resolve,reject)=>{
            db.query(query,[postData.postTitle,postData.postContent,postData.userId,postData.postImage],(err,result)=>{
                if(err){
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    // 게시글 목록 조회
    getAllPosts: async () => {
        const sql = `
        SELECT  b.board_id, b.page_title, b.likes_count, b.create_at, b.view_count, b.comment_count, u.nickname, u.profile
        FROM board AS b
        JOIN user AS u ON b.user_fk = u.user_id
        ORDER BY b.board_id DESC;
        `;

        try {
            const results = await db.promise().query(sql);
            return results;
        } catch (error) {
            throw new Error('게시글 조회 실패: ' + error.message);
        }
    },
    getPosts: async (board_id) => {
        
        const sql = `
        SELECT * FROM board,user WHERE board.board_id=${board_id} and board.user_fk=user.user_id;
        `;
        
        try {
            const results = await db.promise().query(sql);
            return results;
        } catch (error) {
            throw new Error('게시글 조회 실패: ' + error.message);
        }
    },

    deletePost: async (board_id)=>{
        const sql=`DELETE FROM board WHERE board_id=${board_id};`
        try{
            const result= await db.promise().query(sql);
            return result;
        } catch(error){
            throw new Error('게시글 삭제 실패: ' + error.message);
        }
    }


};

module.exports=Post;