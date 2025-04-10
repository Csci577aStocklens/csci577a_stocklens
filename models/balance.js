const mongoose=require("mongoose");

const balanceschema= new mongoose.Schema({
    balance:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model('balance',balanceschema);