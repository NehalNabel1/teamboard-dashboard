
const mongoose = require('mongoose');
const requiredString = {type : String , required:true};
const requiredNumber = {type : Number , required:true};
const memberSchema = mongoose.Schema({
    name : requiredString,
    age : requiredNumber,
    uni :  requiredString,
    email :{type : String , required:true , unique : true},
    phone : requiredString,
    tech : requiredString,
    img :{type : String ,required :false}

})

const Member = mongoose.model('member', memberSchema);
module.exports = Member;