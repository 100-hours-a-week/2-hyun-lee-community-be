import db from '../config/db.js'; 



const Post = {
    create: async (postData)=>{
        try {
            const query = `
                INSERT INTO board 
                (page_title, page_content, create_at, user_id, likes_count, view_count, page_image, comment_count) 
                VALUES (?, ?, NOW(), ?, 0, 0, ?, 0)
            `;

            const postTitle = postData.postTitle ?? null;
            const postContent = postData.postContent ?? null;
            const userId = postData.userId ?? null;
            const postImage = postData.page_image ?? null;

        
            const [results] = await db.execute(query, [
                postTitle,
                postContent,
                userId,
                postImage
            ]);  
            return results[0]; 
        } catch (err) {
            console.error(err.message);
        }
    },

    // 게시글 목록 조회
    getAllPosts: async () => {
        const sql = `
        SELECT b.post_id, b.page_title, b.likes_count, b.create_at, b.view_count, b.comment_count, u.nickname, u.profile
        FROM board AS b
        JOIN user AS u ON b.user_id = u.user_id
        ORDER BY b.post_id DESC;
    `;

    try {
        const [results] = await db.execute(sql);
        return results;
    } catch (error) {
        console.error(error.message);
        
    }
    },
    getPosts: async (post_id) => {
        
        const updateSql = `
        UPDATE board 
        SET view_count = view_count + 1 
        WHERE post_id = ?;
        `;

        const sql = `
        SELECT * FROM board,user WHERE board.post_id= ? and board.user_id=user.user_id;
        `;

        
        try {
            await db.execute(updateSql,[post_id]);
            const results = await db.execute(sql,[post_id]);
            return results[0];
        } catch (error) {
            throw new Error('게시글 조회 실패: ' + error.message);
        }
    },

    deletePost: async (post_id)=>{
        const sql=`DELETE FROM board WHERE post_id=?;`
        try{
            const result= await db.execute(sql,[post_id]);
            return result;
        } catch(error){
            console.log(error)
        }
    },
    deleteAllPosts : async (user_id)=>{
        
        const sql = `DELETE FROM board WHERE user_id = ?`;
        try{
            const result = await db.execute(sql,[user_id]);
            return result[0];
        } catch(error){
            console.error(error);
        }
    },
    updatePost: async(post_id,postData) =>{
        const sql = ` UPDATE board SET page_title = ?, page_content = ?, page_image = ?, create_at = NOW() WHERE post_id = ?;`;

        try{
        const [result] = await db.execute(sql, [
            postData.page_title,
            postData.page_content,
            postData.page_image,
            post_id,
        ]);
        return result;
        } catch(error){
            console.error(error);
        }


    },
    updateLikes: async(post_id) =>{
        const sql = `UPDATE board SET likes_count = likes_count + 1 WHERE post_id = ?;`;
        try{
            const [result] = await db.execute(sql,[post_id]);
            return result;
        }catch(error){
            console.error(error);
        }


    }

    
};


export default Post;