const express=require("express");
const { default: mongoose } = require("mongoose");
const router=express.Router();

const portschema=require("../models/portfolio");
const { json } = require("body-parser");


router.get("/",async(req,res)=>{
    try{
        const response=await portschema.find();
        res.json(response);
        }
        catch(err){
            console.log("err",err);
        }
    });

router.post("/sub",async(req,res)=>{
        console.log(req.body);
        try{
            const isPresent = await portschema.findOne({ "ticker" : req.body.ticker });            // response1.some(obj => obj.ticker == req.body.ticker);
            console.log(isPresent,"isPresent");
            isPresent.qnt -= req.body.qnt;
            isPresent.total-=req.body.total;

            const response=await isPresent.save();
            res.json(response);
        }catch(err){
        res.send(err);
        }
        });
 
router.post("/",async(req,res)=>{
            console.log(req.body,"req.body");
    //        console.log("req",req);
            const u=new portschema({
                ticker:req.body.ticker,
                name:req.body.name,
                qnt:req.body.qnt,
                total: req.body.total
            })
            try{
                const response1=await portschema.find();
                const isPresent = await portschema.findOne({ "ticker" : req.body.ticker });            // response1.some(obj => obj.ticker == req.body.ticker);
                console.log(isPresent,"isPresent","response",response1);
                if (!isPresent){// add to the quantity
                    const response=await u.save();
                    console.log("success");
                    res.json(response);
                    
                }
                else{
                    isPresent.qnt += req.body.qnt;
                    isPresent.total+=req.body.total;
                    const response=await isPresent.save();
                    console.log("success");
                    res.json(response);
                }
                
            }catch(err){
            res.send("err",err);
            }
            });
     

router.delete("/:id",async (req, res) =>{
        try {
            console.log(req.params.id);
            const user = await portschema.findOneAndDelete( {"ticker":req.params.id})   //, function (err, doc) {                      //findByIdAndRemove(req.params.id, function (err, doc) {
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
    

