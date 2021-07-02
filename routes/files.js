const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const File   = require('../models/file');
const {v4 : uuid4} = require('uuid'); // using version 4 api

// why uuid is used ? so that noone can download our file without link , by just typing random url easily

let storage = multer.diskStorage({
    destination : (req,file,callback)=>callback(null,'uploads/'),
    filename    : (req,file,callback)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        callback(null,uniqueName);
    }
})

let upload = multer({
    storage : storage,
    limits   : {fileSize : 1000000 * 100},

}).single('myfile');  // as we are uploading single file

router.post('/',(req,res)=>{
    // store file
    upload(req,res,async (err)=>{
        // validate req 
        if(!req.file)return res.json({error : 'All fields are required '});        
        if(err) return res.status(500).send({error : err.message});
        // store in database
        const file = new File({ // required on top 
           filename : req.file.filename, 
           uuid     : uuid4(),
           path     : req.file.path , // joins destination and filename to make path , fun is multer.diskstorage
           size     : req.file.size 
        })
        try{
            const response = await file.save(); 
            // this is download link
            // the url will be like http://localhost:3000/files/asidjfknlasdnf94
            res.json({file : `${process.env.APP_BASE_URL}/files/${response.uuid}`}); // domain name shouldn't be hardcoded , whatever we written in env is needed which is dynamic
        }catch (err){
            console.log(err);
        }
    })    
    // response->contains download link 
})

router.post('/send',async(req,res)=>{
    const {uuid,emailTo,emailFrom} = req.body;
    // validate req , 422 is validation error
    if(!uuid || !emailTo || !emailFrom)return res.status(422).send({error : 'All fields are required'});
    // get data from database
    const file = await File.findOne({uuid : uuid});
    // if there is sender , means email has been already sent
    // if(file.sender)return res.status(422).send({error : 'Email already sent'});
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    // send email , this sendMail is our custom fun
    const sendMail = require('../services/emailService');
    sendMail({
        from    : emailFrom,
        to      : emailTo,
        subject : 'fileshare',
        text    : `${emailFrom} shared a file with you` , 
        html    : require('../services/emailTemplate')({
            emailFrom    : emailFrom,
            downloadLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size         : parseInt(file.size/1000) + ' KB',
            expires      : '24 hours'
        })
    });
    res.send({success : true});  
});

module.exports = router;