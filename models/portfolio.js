const mongoose=require("mongoose");

const portschema= new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    ticker:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    qnt:{
        type:Number,
        required:true
    },
    total:{
        type:Number,
        required:true
    },
});

module.exports=mongoose.model('portfolio',portschema);