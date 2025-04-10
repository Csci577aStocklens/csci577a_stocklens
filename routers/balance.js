const express=require("express");
const { default: mongoose } = require("mongoose");
const router=express.Router();

const balanceschema=require("../models/balance");
const { json } = require("body-parser");


router.get("/",async(req,res)=>{
    try{
        const response=await balanceschema.find();
        res.json(response);
        }
        catch(err){
            console.log("err",err);
        }
});
//update the balance

router.post("/",async(req,res)=>{
    console.log(req.body);
    try{
        let isPresent = await balanceschema.find();            // response1.some(obj => obj.ticker == req.body.ticker);
        console.log(isPresent,"isPresent");
        isPresent[0].balance -= req.body.balance;
        console.log(isPresent.balance);
        const response=await isPresent[0].save();
        res.json(response);
    }catch(err){
    res.send(err);
    }
    });

    module.exports=router
