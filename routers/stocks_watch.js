const express = require("express");
const router = express.Router();
const StocksWatch = require("../models/stocks_watch");
const config = require("../config");

// Get all watchlist items for the current user
router.get("/", async (req, res) => {
    try {
        const watchlist = await StocksWatch.find({ userId: config.currentUserId });
        res.json(watchlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a stock to watchlist for the current user
router.post("/", async (req, res) => {
    const watchlistItem = new StocksWatch({
        userId: config.currentUserId,
        ticker: req.body.ticker,
        c_name: req.body.c_name
    });

    try {
        const newWatchlistItem = await watchlistItem.save();
        res.status(201).json(newWatchlistItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a stock from watchlist for the current user
router.delete("/:ticker", async (req, res) => {
    try {
        const watchlistItem = await StocksWatch.findOneAndDelete({ 
            userId: config.currentUserId,
            ticker: req.params.ticker 
        });
        if (watchlistItem) {
            res.json({ message: "Stock removed from watchlist" });
        } else {
            res.status(404).json({ message: "Stock not found in watchlist" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
    

