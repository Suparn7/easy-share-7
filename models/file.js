const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const fileSchema = new Schema({
    filename:{type: String, required: true},
    path:{type: String, required:true},
    size:{type: Number, required: true},
    uuid:{type: String, required: true},
    sender:{type: String, required: false},//false qki agar user send nhi krta sirf copy krta hai link
    receiver:{type: String, required: false}
}, {timestamps: true});//timestamp will generate created at wagerah


module.exports = mongoose.model('File', fileSchema);