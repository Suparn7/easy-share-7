require('dotenv').config();

const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify:true});//MONGOCONNECTIONURL will be secret as it will have password wagerah hence put under dotenv 
    const connection = mongoose.connection; //connection stored over a variable named connection 

    connection.once('open', ()=> {
        console.log('Database connected');
    }).catch((err) => {
        console.log('Connection failed');
    })
}

module.exports = connectDB;