const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
    create: async (userData) => {
        try {

            // 이메일 중복 확인
            const emailExists = await User.findByEmail(userData.useremail);
            if (emailExists) {
                throw new Error('이미 사용 중인 이메일입니다.');
            }

            // 닉네임 중복 확인
            const nicknameExists = await User.findByNickname(userData.nickname);
            if (nicknameExists) {
                throw new Error('이미 사용 중인 닉네임입니다.');
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            const query = 'INSERT INTO user (useremail, reg_date, password, nickname, profile) VALUES (?, NOW(), ?, ?, ?)';
            return new Promise((resolve, reject) => {
                db.query(query, [userData.useremail, hashedPassword, userData.nickname, userData.profile], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        } catch (err) {
            throw err; // 오류를 throw하여 상위에서 처리하도록 함
        }
    },

    loginCheck: async (userData)=>{
        const {email,password}=userData;
        try{
            const results = await new Promise((resolve, reject) => {
                db.query('SELECT * FROM user WHERE useremail = ?', [email], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });

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
        return new Promise((resolve,reject)=>{
            db.query('SELECT * FROM user WHERE useremail = ?', [email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.length > 0); // 중복이면 true, 아니면 false 반환
            });
        });
        
    },
    findByNickname: async (nickname) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM user WHERE nickname = ?', [nickname], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.length > 0); // 중복이면 true, 아니면 false 반환
            });
        });
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

module.exports = User;
