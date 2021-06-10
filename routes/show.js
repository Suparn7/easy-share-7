const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res)=>{//: matlab dynamic parameter hai, har ek req k liye change hogi
    //fetch one row from db, as we are storing in db while uploading
    //ek query likhenge and findOne use krenge with a condition that kaunse condition pe fetch krenge
    try{
        const file = await File.findOne({uuid: req.params.uuid});//req.params mein saare parameter hote hain jaise dynamic parameter : uuid
        if(!file){//file nahi hai toh bhi download page render krenge along with link expired
            return res.render('download',{error: 'Link has been expired.'});//2nd param se data bhejskte hain frontend pe
        }

        //agar file hai, data list kro fontend pe jo bhejenge
        return res.render('download', {
            uuid: file.uuid,
            fileName : file.fileName,//yesab db k andar hain
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`//download link hamein btn pe attach krna hai kintu link generate aise krenge ham mast
            //http://localhost:3000/files/download/535453g4fdg5345sg7-4534f343s353g aisi hogi link jisko download btn pe attach krenge
        })
    }catch(err){//error aagyi toh download page render krenge with something went wrong
        return res.render('download',{error: 'Something went wrong.'});//2nd param se data bhejskte hain frontend pe
    }
    
})




module.exports = router;