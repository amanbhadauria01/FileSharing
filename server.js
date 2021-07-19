const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;   
const connectDB = require('./config/db');
const path = require('path');
const cors = require("cors");
require("dotenv").config();
const cron = require('node-cron');
const CleanOldData = require('./services/checkmemory');
// connect database
connectDB();

// cors
app.use(cors());
app.options('*', cors());

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

// Schedule tasks to be run on the server every day 4 a.m. -> 0 4 * * *
cron.schedule('0 4 * * *', function() {
    console.log('cleaning started');
    CleanOldData().then(()=>{
    // to stop script
    console.log('cleaned');
    });
});

app.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`);
})