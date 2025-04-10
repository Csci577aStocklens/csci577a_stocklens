const express=require("express");
const { default: mongoose } = require("mongoose");
const router=express.Router();

const watchschema=require("../models/stocks_watch");
const { json } = require("body-parser");


router.get("/",async(req,res)=>{
    try{
        const response=await watchschema.find();
        res.json(response);
        }
        catch(err){
            console.log("err",err);
        }
    });

router.post("/",async(req,res)=>{
        console.log(req.body);
//        console.log("req",req);
        const u=new watchschema({
            ticker:req.body.ticker,
            c_name:req.body.c_name
        })
        try{
            const response1=await watchschema.find();
            const isPresent = response1.some(obj => obj.ticker == req.body.ticker);
            console.log(isPresent,"isPresent",response1);
            if (!isPresent){
                const response=await u.save();
                res.json(response);
            }
            
        }catch(err){
        res.send(err);
        }
        });
 

router.delete("/:id",async (req, res) =>{
        try {
            console.log(req.params.id);
            const user = await watchschema.findOneAndDelete( {"ticker":req.params.id})   //, function (err, doc) {                      //findByIdAndRemove(req.params.id, function (err, doc) {
               // if (err) console.log(err);
               // res.status(200).json({message: "deleted succesfully"})
               // });
               if (!user) {
                return res.status(400).send('Item not found');
              }
              return res.status(200).send("Id " + req.params.id + " has been deleted");
          
           // res.status(200).json({message: "deleted succesfully"})
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    });
    
    module.exports=router
    

