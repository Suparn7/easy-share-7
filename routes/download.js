const router = require('express').Router();
const File = require('../models/file');


//server.js mein already files/download hai, yahan bas uuid dynamically add krdenge

router.get('/:uuid', async (req,res) => {
    const file = await File.findOne({uuid: req.params.uuid});
    if(!file){
        return res.render('download', {error: 'Link has been expired.'})
    }

    //agar file miljati hai toh
    const filePath = `${__dirname}/../${file.path}` //dirname means curr directory, isse ek folder bahar nikle and then uploads mein hai file jisko hamein download krna hai, toh since dp mein path mein already uploads dala hua hai toh krdo file.path
    res.download(filePath); //that's how we download in express
})



module.exports = router;