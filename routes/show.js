const router = require('express').Router();
const File   = require('../models/file');

// : given as uuid is a dynamic parameter
// : means dynamic parameter
// req.params contains all these parameters
router.get('/:uuid',async(req,res)=>{
   // wheneven we use await , we do error handling
   try{
       const file = await File.findOne({ uuid : req.params.uuid});
       if(!file)return res.render('download',{error : 'Link has been expired.'}); 
       return res.render('download',{
          uuid     : file.uuid , 
          fileName : file.filename ,
          fileSize : file.size , 
          downloadLink : `${process.env.APP_BASE_URL}/files/download/${file.uuid}` 
       });  
   }catch(err){
       // in render the second parameter is used to send data to frontend
       return res.render('download',{error : 'Something went wrong.'});    
   }
   
});

module.exports = router;