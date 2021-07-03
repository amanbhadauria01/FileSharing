const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;   
const connectDB = require('./config/db');
const path = require('path');
const cors = require("cors");
const cron = require('node-cron');
require("dotenv").config();
const CleanOldData = require('./services/checkmemory');

// connect database
connectDB();

app.use(cors());
app.options('*', cors());
// const corsOptions = {
//     origin: process.env.ALLOWED_CLIENTS.split(","),
// };
  
// app.use(cors(corsOptions));

// static folder
app.use(express.static('public'));
app.use(express.json());

// template engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

// routes
// app.use('/', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "*");
//     res.header("Access-Control-Allow-Methods", "POST");
//     console.log("Passed 1");
//     next();
// });

app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));

// Schedule tasks to be run on the server every day 4 a.m. -> 0 4 * * *
cron.schedule('* * * * *', function() {
    console.log('cleaning started');
    CleanOldData().then(()=>{
    // to stop script
    console.log('cleaned');
    process.exit();
    });
});

app.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}`);
})