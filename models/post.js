import db from '../config/db.js'; 



const Post = {
    create: async (postData)=>{
        try {
            const query = `
                INSERT INTO board 
                (post_title, post_content, create_at, user_id, view_count, post_image) 
                VALUES (?, ?, NOW(), ?, 0, ?)
            `;
            const selectSql=` SELECT * FROM board WHERE post_id = LAST_INSERT_ID(); `

            const postTitle = postData.postTitle ?? null;
            const postContent = postData.postContent ?? null;
            const userId = postData.userId ?? null;
            const postImage = postData.post_image ?? null;

        
           await db.execute(query, [
                postTitle,
                postContent,
                userId,
                postImage
            ]);
            const result = await db.execute(selectSql);
            return result[0]; 
        } catch (err) {
            console.error(err.message);
        }
    },
    getAllPosts: async () => {
        const sql = `SELECT b.post_id, b.post_title, (SELECT COUNT(*) FROM likes l WHERE l.post_id = b.post_id) AS likes_count,(SELECT COUNT(*) FROM comment c WHERE c.post_id = b.post_id) AS comment_count, b.create_at, 
                    b.view_count, u.nickname, u.profile_image FROM board AS b JOIN users AS u ON b.user_id = u.user_id ORDER BY b.post_id DESC;
    `;

    try {
        const [results] = await db.execute(sql);
        return results;
    } catch (error) {
        console.error(error.message);
        
    }
    },
    getPosts: async (post_id) => {
        

        const sql = `SELECT b.post_id, b.user_id, b.post_title, b.post_content, b.post_image, b.create_at, b.view_count, u.nickname, u.profile_image,
                    (SELECT COUNT(*) FROM likes l WHERE l.post_id = b.post_id) AS likes_count,
                    (SELECT COUNT(*) FROM comment c WHERE c.post_id = b.post_id) AS comment_count 
                    FROM board AS b JOIN users AS u ON b.user_id = u.user_id WHERE b.post_id = ?;
`;
        try {
            const results = await db.execute(sql,[post_id]);
            return results[0];
        } catch (error) {
            throw new Error('게시글 조회 실패: ' + error.message);
        }
    },
    updateViews : async(post_id)=>{
        const sql = `
        UPDATE board 
        SET view_count = view_count + 1 
        WHERE post_id = ?;
        `;
        try{
            const result= await db.execute(sql,[post_id]);
            return result[0];
        }catch(error){
            console.error(error);
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
    getAllPostsByUserId : async (user_id)=>{
        const sql =`SELECT * FROM board WHERE user_id =?`;
        try{
            const [rows] = await db.execute(sql,[user_id]);
            return rows;
        } catch(error){
            console.error(error);
        }
    },
    updatePost: async(post_id,postData) =>{
        const sql = ` UPDATE board SET post_title = ?, post_content = ?, post_image = ?, create_at = NOW() WHERE post_id = ?;`;

        try{
        const [result] = await db.execute(sql, [
            postData.post_title,
            postData.post_content,
            postData.post_image,
            post_id,
        ]);
        return result;
        } catch(error){
            console.error(error);
        }


    },
    likesStatus: async(post_id)=>{
        const sql=`SELECT liked_by_user FROM board WHERE post_id = ?`;
        try{
            const result = await db.execute(sql,[post_id]);
            return result[0];
        } catch(error){
            console.error(error);
        }

    },
    updateLikes: async(post_id,user_id) =>{
        const getLikesSql = `SELECT liked_by_user, likes_count FROM board WHERE post_id = ?`;
        const updateLikesSql = `UPDATE board SET liked_by_user = ?, likes_count = ? WHERE post_id = ?;`;

        try{
            const [rows] = await db.execute(getLikesSql, [post_id]);
            let likedUsers = rows[0].liked_by_user ? JSON.parse(rows[0].liked_by_user) : [];
            let likesCount = rows[0].likes_count || 0;

            if (likedUsers.includes(user_id)) {
                likedUsers = likedUsers.filter(id => id !== user_id); 
                likesCount -= 1; 
            } else {
                likedUsers.push(user_id); 
                likesCount += 1; 
            }

            await db.execute(updateLikesSql, [JSON.stringify(likedUsers), likesCount, post_id]);
            
            return { success: true, message:"좋아요 업데이트" };
        }catch(error){
            console.error(error);
        }


    }

    
};


export default Post;