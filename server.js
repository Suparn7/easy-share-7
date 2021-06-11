require('dotenv').config();
const express = require('express');

const app = express();
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000; 
app.use(express.static('public'));
app.use(express.json());//middleware to enable express parsing the json data
const connectDB = require('./config/db');
const { METHODS } = require('http');
connectDB();

//cors

const corsOptions = {
    //origin ko ham env mein rkhrhe as a string , yahan array mein receive krna hai toh split krenge
    //origin: process.env.ALLOWED_CLIENTS.split(','),//origin pe wo saare options dene hote hain jahan se cors allow karna hai, multiple clients agar use krrhe hain toh simply array use krna hai
    origin: "*",
    //['http://localhost:3000', 'http://localhost:5000'], aisa receive hoga yahan
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}
app.use(cors(corsOptions)); //cors is a middleware

//Template engine
app.set('views', path.join(__dirname, '/views'));//path.join currfolder yaani dirname/views se join krke hmein ek joined utl dedega
app.set('view engine', 'ejs');
//routes
app.use('/api/files', require('./routes/files'));//ab module mein simply / se kaam chljayega
app.use('/files', require('./routes/show'));//show wale se download page show krenge
app.use('/files/download', require('./routes/download'));//downloadLink ka kaam yahin hoyega


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})