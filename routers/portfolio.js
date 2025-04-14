const express=require("express");
const { default: mongoose } = require("mongoose");
const router=express.Router();

const portschema=require("../models/portfolio");
const { json } = require("body-parser");
const config = require("../config");

// Get portfolio for current user
router.get("/",async(req,res)=>{
    try{
        const response = await portschema.find({ userId: config.currentUserId });
        res.json(response);
    }
    catch(err){
        console.log("err",err);
        res.status(500).json({ error: err.message });
    }
});

// Subtract from portfolio for current user
router.post("/sub",async(req,res)=>{
    console.log(req.body);
    try{
        const isPresent = await portschema.findOne({ 
            userId: config.currentUserId,
            ticker: req.body.ticker 
        });
        if (!isPresent) {
            return res.status(404).json({ error: "Stock not found in portfolio" });
        }
        
        // Check if user has enough stocks to sell
        if (isPresent.qnt < req.body.qnt) {
            return res.status(400).json({ error: "Not enough stocks to sell" });
        }

        isPresent.qnt -= req.body.qnt;
        isPresent.total = isPresent.total * (isPresent.qnt / (isPresent.qnt + req.body.qnt));

        if (isPresent.qnt <= 0) {
            await portschema.findOneAndDelete({ 
                userId: config.currentUserId,
                ticker: req.body.ticker 
            });
            return res.json({ message: "Stock removed from portfolio" });
        }

        const response = await isPresent.save();
        res.json(response);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});
 
// Add to portfolio for current user
router.post("/",async(req,res)=>{
    console.log(req.body,"req.body");
    const portfolioItem = {
        userId: config.currentUserId,
        ticker: req.body.ticker,
        name: req.body.name,
        qnt: req.body.qnt,
        total: req.body.total
    };

    try{
        const isPresent = await portschema.findOne({ 
            userId: config.currentUserId,
            ticker: req.body.ticker 
        });

        if (!isPresent){
            const newItem = new portschema(portfolioItem);
            const response = await newItem.save();
            res.json(response);
        }
        else{
            isPresent.qnt += req.body.qnt;
            isPresent.total += req.body.total;
            const response = await isPresent.save();
            res.json(response);
        }
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

// Delete portfolio item for current user
router.delete("/:ticker",async (req, res) =>{
    try {
        console.log(req.params.ticker);
        const user = await portschema.findOneAndDelete({ 
            userId: config.currentUserId,
            ticker: req.params.ticker
        });
        if (!user) {
            return res.status(404).json({ error: "Stock not found in portfolio" });
        }
        return res.status(200).json({ message: "Stock removed from portfolio" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
    
module.exports = router;
    

