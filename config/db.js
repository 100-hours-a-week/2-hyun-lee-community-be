import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import colors from 'colors';


dotenv.config();


const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

(async () => {
    try {
        const connection = await db.getConnection(); 
        console.log('DB connected!'.green);
        connection.release(); 
    } catch (err) {
        console.error('DB connection error'.red, err);
    }
})();

export default db;