const express=require("express");
const { default: mongoose } = require("mongoose");
const router=express.Router();

const balanceschema=require("../models/balance");
const { json } = require("body-parser");
const config = require("../config");

// Get balance for current user
router.get("/",async(req,res)=>{
    try{
        let userBalance = await balanceschema.findOne({ userId: config.currentUserId });
        if (!userBalance) {
            userBalance = new balanceschema({
                userId: config.currentUserId,
                balance: 10000 // Default balance
            });
            await userBalance.save();
        }
        res.json(userBalance);
    }
    catch(err){
        console.log("err",err);
        res.status(500).json({ error: err.message });
    }
});

// Update balance for current user
router.post("/",async(req,res)=>{
    console.log("Balance update request:", req.body);
    try{
        let userBalance = await balanceschema.findOne({ userId: config.currentUserId });
        if (!userBalance) {
            userBalance = new balanceschema({
                userId: config.currentUserId,
                balance: 10000 // Default balance
            });
        }
        
        // If balance is positive, add to current balance
        // If balance is negative, subtract from current balance
        userBalance.balance += req.body.balance;
        
        // Ensure balance doesn't go below 0
        if (userBalance.balance < 0) {
            return res.status(400).json({ error: "Insufficient balance" });
        }
        
        const response = await userBalance.save();
        res.json(response);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
