const File = require('./models/file');
const fs = require('fs');
const connectDB = require('./config/db');
connectDB();


async function deleteData(){
    //fetch all files from db joki 24 hours purani ho, model use krte hain

    const pastDate = new Date (Date.now() - 24 * 60 * 60 * 1000); //date.now  miliseconds mein hota hai usse 24 hours kam krna pdega isliye 24hours ko miliseconds mein convert krte hain

    //createdAt miliseconds mein nahi hai, toh pastDate jo bni h miliseconds mein usko normal date mein convert krna pdega
    //uske liye new Date() k andar date.now wala conversion, ab pastDate exact 24 hours piche hogya
    //$lt is less than, createdAt kisse lessthan? less than pastDate yani 24 hour rhe toh filter krke data fetch krlenge
    //and then delete them

    const files = await File.find({createdAt: {$lt : pastDate}}) //jobhi createdAt pastDate se kam hai toh hamein dedo files ki array
    if(files.length){
        for(const file of files){
            try{
                fs.unlinkSync(file.path);//one by one deleted from storage yaani upload folder
                await file.remove();
                console.log(`succesfully deleted ${file.filename}`);
            }catch(err){
                console.log(`Error while deleting file ${err}`);
            }
        }
        console.log('Job Done');
    }
}

deleteData().then(process.exit)