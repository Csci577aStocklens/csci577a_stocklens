const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const StocksWatch = require("../models/stocks_watch");
const { consumerPollProducersForChange } = require('@angular/core/primitives/signals');

const FINNHUB_API_KEY = 'd025c0hr01qt2u3242egd025c0hr01qt2u3242f0' //process.env.FINNHUB_API_KEY;

const getProfile = async (symbol) => {
  try {
    const { data } = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    
    return data;
  } catch {
    return {};
  }
};

const getStockPerformance = async (symbol) => {
  try {
    const { data } = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    if (data.c && data.o) {
      return ((data.c - data.o) / data.o) * 100;
    }
  } catch {}
  return 0;
};

const getPeers = async (symbol) => {
  try {
    const { data } = await axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    return data;
  } catch {
    return [];
  }
};

const getTopPerformers = async (symbols) => {
  const ranked = [];
  for (const sym of symbols) {
    const profile = await getProfile(sym);
    if (!profile || !profile.finnhubIndustry) continue;
    const performance = await getStockPerformance(sym);
    ranked.push({
      symbol: sym,
      logo: profile.logo || '',
      industry: profile.finnhubIndustry || 'Unknown',
      performance,
    });
  }
  return ranked.sort((a, b) => b.performance - a.performance);
};

const getSectorStocks = () => ({
  "Technology": ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'AMD', 'META', 'CRM'],
  "Healthcare": ['PFE', 'JNJ', 'UNH', 'MRK', 'ABBV', 'TMO'],
  "Financial": ['JPM', 'BAC', 'WFC', 'C', 'GS', 'MS'],
  "Consumer Defensive": ['WMT', 'PG', 'COST', 'PEP', 'KO'],
  "Energy": ['XOM', 'CVX', 'COP', 'SLB', 'EOG']
});

// Mock watchlist
// Just return a list of tickers from DB or static list (no res.json here)
const getUserWatchlist = async (userId) => {
    try {
      console.log("userId", userId);
      const watchlist = await StocksWatch.find({ userId });
      console.log("watchlist", watchlist);
      if (!watchlist || watchlist.length === 0) {
        return ['AAPL', 'GOOGL', 'MSFT', 'NVDA', 'TSLA', 'AMD', 'META', 'CRM', 'PFE', 'JNJ'];
      }
      return watchlist.map(item => item.ticker);
    } catch (err) {
      console.error('Error fetching watchlist, using fallback:', err.message);
      return ['AAPL', 'GOOGL', 'MSFT', 'NVDA', 'TSLA', 'AMD', 'META', 'CRM', 'PFE', 'JNJ'];
    }
  };
  


// Mock function to get user watchlist

router.get('/watchlist/:userId', async (req, res) => {
  const userWatchlist =await getUserWatchlist(req.params.userId);
  const result = [];

  for (const symbol of userWatchlist) {
    const profile = await getProfile(symbol);
    const performance = await getStockPerformance(symbol);
    result.push({
      symbol,
      logo: profile.logo || '',
      industry: profile.finnhubIndustry || 'Unknown',
      performance
    });
  }

  res.json(result);
});

router.get('/recommendations/:userId', async (req, res) => {

    const userWatchlist = await getUserWatchlist(req.params.userId);
    console.log("userWatchlist", userWatchlist);
    
    const industryMap = {};
    const watchlistData = [];
  
    // Populate industryMap and watchlistData
    for (const symbol of userWatchlist) {
      const profile = await getProfile(symbol);
      const industry = profile.finnhubIndustry || 'Unknown';
      const performance = await getStockPerformance(symbol);
      if (!industryMap[industry]) industryMap[industry] = [];
      industryMap[industry].push(symbol);
      watchlistData.push({
        symbol,
        logo: profile.logo || '',
        industry,
        performance
      });
    }
  
    // Calculate total stocks and industry counts
    const total = Object.values(industryMap).reduce((acc, v) => acc + v.length, 0);
    let recommendations = {};
  
    // Function to get recommendations with inverse proportion based on user watchlist
    const getIndustryRecommendations = async (industry, symbols, useInverseProportion) => {
      const industryTotal = symbols.length;
      const userCount = industryMap[industry] ? industryMap[industry].length : 0;
  
      // The number of new recommendations is inversely proportional to how many stocks the user already has
      const newRecommendationCount = useInverseProportion ? Math.max(5 - userCount, 0) : 5; // Ensure at least 0 new recommendations
      const recommendedSymbols = [];
      
      // If the user already has some stocks in this industry, limit new recommendations
      if (userCount > 0) {
        const peers = await getPeers(symbols[0]); // Assuming at least one symbol exists
        const topPeers = await getTopPerformers(peers.slice(0, 3));
  
        // Avoid duplicates by filtering out the symbols already in the user's watchlist
        const filteredTopPeers = topPeers.filter(peer => !userWatchlist.includes(peer.symbol));
        
        recommendations[industry] = [...(recommendations[industry] || []), ...filteredTopPeers.slice(0, newRecommendationCount)];
      }
  
      // If there are still missing recommendations, get from other sources
      if (newRecommendationCount > 0) {
        const topPerformers = await getTopPerformers(symbols.slice(0, 3));  // You can change the number of peers or symbols
  
        // Avoid duplicates by filtering out the symbols already in the user's watchlist
        const filteredTopPerformers = topPerformers.filter(peer => !userWatchlist.includes(peer.symbol));
        
        recommendations[industry] = [...(recommendations[industry] || []), ...filteredTopPerformers.slice(0, newRecommendationCount)];
      }
  
      // Ensure no duplicates within the same industry
      recommendations[industry] = Array.from(new Set(recommendations[industry].map(item => item.symbol)))
                                         .map(symbol => recommendations[industry].find(item => item.symbol === symbol));
      
      return recommendations[industry];
    };
  
    // Process each industry for recommendations
    for (const [industry, symbols] of Object.entries(industryMap)) {
      const useInverseProportion = true;
      await getIndustryRecommendations(industry, symbols, useInverseProportion);
    }
  
    // Handle industries that aren't in the user's watchlist (show at least 5)
    const sectorStocks = getSectorStocks();
    for (const [industry, symbols] of Object.entries(sectorStocks)) {
      if (!industryMap[industry]) {
        const topPerformers = await getTopPerformers(symbols.slice(0, 5));
  
        // Filter out user existing stocks from recommendations
        const filteredTopPerformers = topPerformers.filter(stock => !userWatchlist.includes(stock.symbol));
  
        recommendations[industry] = filteredTopPerformers.slice(0, 5);
      }
    }
  
    // Check if all industries have empty lists
    const allEmpty = Object.values(recommendations).every(recs => recs.length === 0);
  
    if (allEmpty) {
      // If all industries are empty, remove the inverse logic and just show peers for each industry
      recommendations = {};
  
      for (const [industry, symbols] of Object.entries(industryMap)) {
        // Set useInverseProportion to false as we're not applying inverse proportion
        await getIndustryRecommendations(industry, symbols, false);
      }
  
      // Handle industries not in the user's watchlist without inverse proportion
      for (const [industry, symbols] of Object.entries(sectorStocks)) {
        if (!industryMap[industry]) {
          const topPerformers = await getTopPerformers(symbols.slice(0, 5));
  
          // Filter out user existing stocks from recommendations
          const filteredTopPerformers = topPerformers.filter(stock => !userWatchlist.includes(stock.symbol));
  
          recommendations[industry] = filteredTopPerformers.slice(0, 5);
        }
      }
    }
  
    // Filter out industries with no recommendations
    const filteredRecommendations = Object.fromEntries(
      Object.entries(recommendations).filter(([industry, recs]) => recs.length > 0)
    );
  
    res.json({ watchlist: watchlistData, recommendations: filteredRecommendations });
  });
  
  module.exports = router;
  