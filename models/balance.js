const mongoose=require("mongoose");

const balanceschema= new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    balance:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model('balance',balanceschema);