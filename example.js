const express = require('express');
const colors = require('colors');
const moment = require('moment');

const app = express();
const PORT = 3000;

app.get('/example',(req,res)=>{
    const requestTime=moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(`${requestTime}.green`);
})

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});