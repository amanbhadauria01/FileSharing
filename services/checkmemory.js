const File = require('../models/file');
const fs   = require('fs');
const connectDB = require('../config/db');
connectDB();

const CleanOldData = async() => {
    // 24 hours old files are fetched and deleted
    const pastDate = new Date(Date.now() - 24*60*60*1000);
    const files = await File.find({ createdAt : { $lt : pastDate}});
    if(files.length){
        for(const file of files){
            try{
                // sync because we are deleting one by one 
                // this is deleting from storage (i.e. upload folder) 
                fs.unlinkSync(file.path);
                // deleting from database
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);                
            }catch (err){
                console.log(`Error while deleting file ${err}`);
            }
        }
        console.log('Job done');
    }
};

// fetchData().then(()=>{
//     // to stop script
//     process.exit();
// });

module.exports = CleanOldData;