import express from 'express';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import colors from 'colors';
import moment from 'moment';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); 




const app= express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use( session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
  cookie: {
      secure: false, 
      httpOnly: true,
      maxAge: 60 * 60 * 1000, 
  },
}));
app.use(
  cors({
    origin: 'http://localhost:8000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  }),
)

// app.use((req, res, next) => {
//   console.log('Session ID:', req.sessionID);
//   console.log('Session Data:', req.session);
//   next();
// });

// 정적 파일 제공
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/',userRoutes); 
app.use('/',postRoutes);
app.use('/',commentRoutes);

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