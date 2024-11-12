// const express=require('express');
// const userRoutes = require('./routes/userRoutes');
// const postRoutes = require('./routes/postRoutes');
// const colors = require('colors');
// const moment = require('moment');
// const path = require('path');
// const cors =require('cors');
// const session = require('express-session');
// require('dotenv').config();


// const app= express();
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(
//     cors({
//       origin: 'http://127.0.0.1:5500/',
//       methods: ['GET', 'POST', 'PATCH', 'DELETE'],
//       credentials: true,
//     }),
//   )
// app.use(session({
//     secret:'secret',
//     resave: false,
//     saveUninitialized: true,
//     cookie:{ secure: false }
// }));


// // 정적 파일 제공
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/', userRoutes); 
// app.use(postRoutes);

// const PORT=3000;

// app.use((err, req, res, next) => {
//     console.error(err.stack); 
//     res.status(err.status || 500).json({
//         message: err.message || 'Internal Server Error'
//     });
// });

// app.use((req, res, next) => {
//     console.log(`Request URL: ${req.url}, Method: ${req.method}`);
//     next();
// });

// app.listen(PORT,()=>{
//     console.log(`server is running at http://localhost:${PORT}`.green);
// });