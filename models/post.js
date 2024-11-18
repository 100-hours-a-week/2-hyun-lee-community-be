import db from '../config/db.js'; 



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
    },
    createComment: async(commentData)=>{
        const insertSql = `INSERT INTO comment (board_fk, user_id, content, create_at) VALUES (?, ?, ?, NOW())`;
        const selectSql = `SELECT * FROM comment,user WHERE comment_id = ? and user.user_id=?`; 
    
        return new Promise((resolve, reject) => {
            db.query(insertSql, [commentData.board_id, commentData.user_id, commentData.content], (err, result) => {
                if (err) {
                    return reject(err);
                }
                const comment_id = result.insertId;
                const user_id=commentData.user_id;
    
                db.query(selectSql, [comment_id,user_id], (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(rows[0]); 
                });
            });
        });
    },
    getAllComments: async(board_id)=>{
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.*, u.nickname, u.profile
                FROM comment c
                JOIN user u ON c.user_id = u.user_id
                WHERE c.board_fk = ${board_id}
                ORDER BY c.create_at DESC
            `;
            db.query(query, [board_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    getComments :async(commentData)=>{
        const sql=`SELECT * FROM comment,user WHERE comment.comment_id=${commentData.commentId} AND comment.user_id=user.user_id AND comment.board_fk=${commentData.boardId}`;

        try {
            const results = await db.promise().query(sql);
            return results;
        } catch (error) {
            throw new Error('게시글 조회 실패: ' + error.message);
        }
        
    },

    deleteComment: async(commentData)=>{
        const sql=`DELETE FROM comment WHERE comment_id=${commentData.commentId}`;
        try{
            const result= await db.promise().query(sql);
            return result;
        } catch(error){
            throw new Error('댓글 삭제 실패: ' + error.message);
        }
    }
};


export default Post;