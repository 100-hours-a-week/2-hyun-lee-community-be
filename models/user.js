import db from '../config/db.js'; 
import bcrypt from 'bcrypt'; 
import mysql from 'mysql2/promise'; 


const User = {
    create: async (userData) => {
        try {

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            const query = 'INSERT INTO user (useremail, password, nickname, profile) VALUES (?, ?, ?, ?)';
            const [results] = await db.execute(query, [userData.useremail, hashedPassword, userData.nickname, userData.profile]);
         
            return results;
        } catch (err) {
            console.error(err.message);
        }

    },

    loginCheck: async (userData)=>{        
        try{
            const {useremail,password}=userData;
            const query = 'SELECT * FROM user WHERE useremail = ?';
            const [results] = await db.execute(query,[useremail]);

            const user = results[0];
            // 비밀번호 비교
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                return { success:true, message: '로그인 성공', user };
            } else {
                return { success: false, message: '*비밀번호가 다릅니다.' };
            }
        } catch (error) {
            throw error; 
        }
    },

    findAll: async (userData) => {
        const { offset, limit } = userData;
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM user LIMIT ${limit} OFFSET ${offset}`, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },
    
    findByEmail: async (email)=>{
       try{
            const query = 'SELECT COUNT(*) as count FROM user WHERE useremail = ?';
            const [result] = await db.execute(query, [email]);
 
            if (result[0].count > 0) {
                return true; 
            }
            return false; 
       } catch(err){
        console.error(err);
        throw err;
       }
        
    },
    checkNickname: async (nickname) => {
        try{
            const query = 'SELECT COUNT(*) as count FROM user WHERE nickname = ?';
            const [result] = await db.execute(query, [nickname]);
            
 
            return result[0].count > 0;
       } catch(err){
        console.error(err);
        throw err;
       }
    },

    checkNicknameForUpdate: async (nickname,user_id) => {
        try{
            const query = 'SELECT COUNT(*) as count FROM user WHERE nickname = ? AND user_id != ?;';
            const [result] = await db.execute(query, [nickname,user_id]);
            
 
            return result[0].count > 0;
       } catch(err){
        console.error(err);
        throw err;
       }
    },

    getUser: async (user_id) => {
        const sql = `SELECT * FROM user WHERE user_id = ?`;
        
        try{
            const [result] = await db.execute(sql,[user_id]);
            return result[0];
        } catch(error){
            console.error(error);
        }
    },

    updateUser: async (user_id,userData)=>{
        const sql = `UPDATE user SET profile = ?, nickname = ? WHERE user_id = ?;`;
        try{
            const [result] = await db.execute(sql,[userData.profileImage, userData.nickname,user_id]);
            return result[0];
        }catch(error){
            console.error(error);
        }
 
    },
    deleteUser: async (user_id)=>{
        const sql =`DELETE FROM user WHERE user_id = ? `;
        try{
            const [result] = await db.execute(sql,[user_id]);
            return result[0];
        } catch(error){
            console.error(error);
        }
    },

    updateUserPassword:async (user_id,password)=>{
        const sql = `UPDATE user SET password = ? WHERE user_id = ?`;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
            
        
        try{
            const [result] = await db.execute(sql,[hashedPassword,user_id]);
            return result[0];
        }catch(error){
            console.error(error);
        }
    }
};

export default User;
