const express=require('express');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const colors = require('colors');
const moment = require('moment');
const path = require('path');
const cors =require('cors');
const session = require('express-session');
require('dotenv').config();


const app= express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge: 60*60*1000}
}));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/', userRoutes);
app.use(postRoutes);
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/community', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'community.html'));
});

app.get('/create-post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create-post.html'));
});
app.get('/detail-post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'detail-post.html'));
});


const PORT=3000;

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}, Method: ${req.method}`);
    next();
});

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`.green);
});