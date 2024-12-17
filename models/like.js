import db from '../config/db.js'; 

const Like = {
    updateLikes: async(post_id,user_id) =>{
        const getLikesSql = `SELECT count(*) as likes_count FROM likes WHERE post_id = ? AND user_id = ?`;
        const updateLikesSql = `INSERT INTO likes (post_id, user_id) VALUES (?, ?)`;
        const deleteLikesSql = `DELETE FROM likes WHERE post_id = ? AND user_id = ?`;
        try{
            const [rows] = await db.execute(getLikesSql, [post_id,user_id]);
            if(rows[0].likes_count>0){
                    await db.execute(deleteLikesSql,[post_id,user_id]);  
                    return { success: true, message:"좋아요 업데이트" };              
            } 

            await db.execute(updateLikesSql, [post_id,user_id]);
            
            return { success: true, message:"좋아요 업데이트" };
        }catch(error){
            console.error(error);
        }


    },
    likesStatus: async(post_id)=>{
        const sql=`SELECT count(*) AS likes_count FROM likes WHERE post_id =?;`;
        try{
            const result = await db.execute(sql,[post_id]);
            return result[0];
        } catch(error){
            console.error(error);
        }

    },
    userLikesStatus: async(post_id,user_id)=>{
        const sql =`SELECT EXISTS (SELECT 1 FROM likes WHERE post_id =? AND user_id =?) AS is_exist`;
        try{
            const result= await db.execute(sql,[post_id,user_id]);
            return result[0]
        } catch(error){
            console.error(error);
        }
    }
    
}

export default Like;