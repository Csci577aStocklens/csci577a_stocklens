const mongoose=require("mongoose");

const watchschema= new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    ticker:{
        type:String,
        required:true
    },
    c_name:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model('stocks_watch',watchschema);