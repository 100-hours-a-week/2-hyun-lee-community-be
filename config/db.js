const mysql = require('mysql2');
const colors = require('colors');
require('dotenv').config();


//mySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err)=>{
    if(err){
        console.err('DB connection error'.red,err);
        return;
    }
    console.log('DB connected!'.green);
});

module.exports=db;