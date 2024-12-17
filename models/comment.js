import db from '../config/db.js'; 


const Comment = {
    
    getAllComments:async (post_id)=>{
        try{
            const sql =`SELECT c.comment_id, c.post_id, c.comment_content, c.create_at, c.user_id, u.nickname, u.profile_image 
                        FROM comment AS c INNER JOIN users AS u ON  c.user_id = u.user_id WHERE c.post_id = ?;`

            const results = await db.execute(sql,[post_id]);
            return results[0];
        } catch (error) {
            console.error(error);
        }
    },
    getComment: async(comment_id) =>{
        try{
            const sql =`SELECT c.comment_id, c.post_id, c.comment_content, c.create_at, c.user_id, u.nickname, u.profile_image 
                        FROM comment AS c INNER JOIN users AS u ON  c.user_id = u.user_id WHERE c.comment_id = ?;`

            const results = await db.execute(sql,[comment_id]);
            return results[0];
        } catch (error) {
            console.error(error);
        }
    },

    createComment:async (commentData)=>{
        const sqlInsert = `
        INSERT INTO comment (post_id, comment_content, create_at, user_id) 
        VALUES (?, ?, NOW(), ?);
        `;

        const sqlSelect = `
        SELECT * FROM comment WHERE comment_id = ?;
        `;

        const sqlUpdate =   `
        UPDATE board
        SET comment_count = comment_count + 1
        WHERE post_id = ?;
        `;
       

        try {
        
            await db.execute(sqlUpdate,[commentData.post_id]);
        
        const [results] = await db.execute(sqlInsert, [
            commentData.post_id,
            commentData.content,
            commentData.user_id,
        ]);

        
        const [rows] = await db.execute(sqlSelect, [results.insertId]);

        return rows[0];
        } catch(error){
            console.error(error);
        }
    },
    deleteComment: async(post_id,comment_id) =>{
        const sql =`DELETE FROM comment WHERE post_id =? AND comment_id = ?;`;
        const sqlUpdate =` UPDATE board SET comment_count = comment_count - 1 WHERE post_id = ?;`;

        try{
            await db.execute(sql,[post_id,comment_id]);
            await db.execute(sqlUpdate,[post_id]);

        }catch(error){
            console.error(error);
        }
    },
    deleteAllComments :async(user_id)=>{
        const sqlSelectBoard = `SELECT post_id FROM board WHERE user_id =?;`;
        const sqlSelectComment = `SELECT post_id FROM comment WHERE user_id =?;`
        const sql = ` DELETE FROM comment WHERE post_id =?;`;
        const sqlDelete =`DELETE FROM comment WHERE user_id = ?`;
        const sqlUpdate =` UPDATE board SET comment_count = comment_count - 1 WHERE post_id = ?;`;

        try{
             const [selectBoardResult] = await db.execute(sqlSelectBoard,[user_id]);
             const boardPostIds = selectBoardResult.map(post => post.post_id);
             const [selectCommentResult] = await db.execute(sqlSelectComment,[user_id]);
             const CommentPostIds = selectCommentResult.map(comment => comment.post_id);
            

            for (const boardPostId of boardPostIds) {
                await db.execute(sql, [boardPostId]);
            }
            for (const CommentPostId of CommentPostIds) {
                await db.execute(sqlUpdate, [CommentPostId]);
            }
            await db.execute(sqlDelete,[user_id]);
            
            return {success: true, message: `${CommentPostIds.length}개의 게시글에 대한 댓글이 삭제되었습니다.`};
        } catch(error){
            console.error(error);
        }
    },

    updateComment: async(post_id,comment_id,newContent)=>{
        const sql =` UPDATE comment SET comment_content = ?, create_at = NOW() WHERE post_id = ? AND comment_id = ?;`;
        try{
            await db.execute(sql,[newContent,post_id,comment_id]);
        } catch(error){
            console.error(error);
        }
    }
}



export default Comment;