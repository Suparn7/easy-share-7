const router = require('express').Router();

const multer = require('multer');

const path = require('path');//for uniquename extension like .jpg, .png here

const File = require('../models/file');
const {v4 : uuidv4} = require('uuid');//version4 ka apis use krna hai



let storage = multer.diskStorage({//diskstorage object bnana hai. default configuration of multer
    destination: (req, file, cb) => cb(null, 'uploads/'),//kahan store krna hai, 3 cheezein aati h req,file and cb, simply cb function call krdo which has 1st parameter as error and second the destination

    filename:(req, file, cb) => {//file ki name ka bhi option deta hai multer
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;//generate uniquename
        cb(null, uniqueName);//disk storage ready
    }
    
})

let upload = multer({
    storage,
    limits:{fileSize: 1000000 * 100},
}).single('myfile');


router.post('/', (req,res)=>{//2nd param req and res hota hai, /api/file server.js mein use krrhe pehle hi
    //store the coming file in uploads folder

    upload(req,res, async (err) => {
        //validiate req: data valid hai ki nhi, ya empty toh nahi
        
        // if(!req.file){//.file ham ek library se dekhenge file, i.e multer, issi se store bhi krenge
        //     return res.json({error: 'Please Upload file First'});
        // }
        
        if(err){
            return res.status(500).send({error: err.message})//koi error ayi toh
            console.log(err);
        }


        //agar err nhi h toh file ka unique naam db mein //store data of uploads file in db
        //to store into db we will be needing model
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(), //unique uuid will be generated
            path: req.file.path, //path destination hojata hai multer joinkrke pura kaam krke dedega
            size: req.file.size
        });
        //send response i.e download link
        const response = await file.save();//save into db
        return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});//key hai file and link hamare domain name se concatinate krna hai qki download link generate krenge baadmei, aur uuid se concatinate krrhe toh ab kuch aisa dikhega abhi : http://localhost:3000/files/3546316fgdg254013-53461fghsd5635dh
    })

});

router.post('/send', async (req,res)=> {
    //validate request
    const {uuid, emailTo, emailFrom, expiresIn} = req.body;

    if(!uuid || !emailTo || !emailFrom){//agar koi ek bhi field nahi mila
        return res.status(422).send({error: 'All fields are required!'}); //validiation status hai 422
    }



    //agar milgya toh get data from database
    //jo file ki link bhejni h uss file ka data db se get krni pdegi

    try{
        const file = await File.findOne({uuid: uuid});//upar wale uuid k equal hai toh dedo

        if(file.sender){//sender hamne already false rkha tha, ab true hai yani already ekbaari mail bhej chuka hai uss file k liye wo sender, baarbaar bhejne nahi denge
            return res.status(422).send({error: 'Email Already sent!'})
        }

        //agar pehle nhi bheja hai
        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();//save krdiya file ko

        //send email
        const sendMail = require('../services/emailService');//SendMail fucn mein ham ek object receive krrhe hain
        sendMail({
            from: emailFrom,
            to: emailTo,
            subject: 'FileSharing through easyShare',
            text: `${emailFrom} shared a file with you`,
            html: require('../services/emailTemplate')({
                emailFrom: emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size/1000) + 'KB',
                expires: '24 hours'
            })
        }).then(() => {
            return res.json({success: true});
          }).catch(err => {
              console.log(err);
            return res.status(500).json({error: 'Error in email sending.'});
          });
      } catch(err) {
        return res.status(500).send({ error: 'Something went wrong.'});
      }
      
      });


module.exports = router;