import AppError from '../utils/AppError.js'; 

const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
      
      res.status(err.statusCode).json({ success: false, message: err.message });
    } else {
      console.error('Unexpected Error:', err);
      res.status(500).json({ success: false, message: '서버 오류' });
    }
  };
  
  export default errorHandler;
  