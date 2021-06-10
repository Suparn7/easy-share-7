const express = require('express');

const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000; 
app.use(express.static('public'));
app.use(express.json());//middleware to enable express parsing the json data
const connectDB = require('./config/db');
connectDB();

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