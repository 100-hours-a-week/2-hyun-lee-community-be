import db from '../config/db.js'; 


const Comment = {
    
    getAllComments:async (post_id)=>{
        try{
            const sql ='SELECT * FROM comment WHERE post_id =?'

            const results = await db.execute(sql,[post_id]);
            return results[0];
        } catch (error) {
            console.error(error);
        }
    },

    createComment:async (commentData)=>{
        const sqlInsert = `
        INSERT INTO comment (post_id, comment_content, create_at, user_id, profile,nickname) 
        VALUES (?, ?, NOW(), ?, ?,?);
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
            commentData.profile,
            commentData.nickname
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
    deleteAllComments :async(post_id)=>{
        const sql = `DELETE FROM comment WHERE post_id =?;`;

        try{
             await db.execute(sql,[post_id]);
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