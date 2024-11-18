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
    findByNickname: async (nickname) => {
        try{
            const query = 'SELECT COUNT(*) as count FROM user WHERE nickname = ?';
            const [result] = await db.execute(query, [nickname]);
 
            if (result[0].count > 0) {
                return true; 
            }
            return false; 
       } catch(err){
        console.error(err);
        throw err;
       }
    },

    findById: async (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM user WHERE useremail = ?', [email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0].userId); 
            });
        });
    },
    findByPassword: async (email)=>{
        return new Promise((resolve,reject)=>{
            db.query('SELECT * FROM user WHERE useremail = ?', [email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.length > 0); // 중복이면 true, 아니면 false 반환
            });
        });
        
    },
};

export default User;
