const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;    
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');

// connect database
connectDB();

const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(","),
  };
  
app.use(cors(corsOptions));

// static folder
app.use(express.static('public'));
app.use(express.json());

// template engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

// routes
app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));

app.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`);
})