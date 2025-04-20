const express = require('express');
const router = express.Router();
const axios = require('axios');

const TOGETHER_API_KEY_TICKER = 'd7391b364663a3f058dfe4ec68eb9fde99f594f941f23f3e19be1c7f43ca579e';
const TOGETHER_API_KEY_PORTFOLIO = '8a5cd81a4f45607d0ff5c7a233bc2273ed28698f67ad1ca16921935947003db7';
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
const STOCK_SEARCH_API_URL = 'https://finnhub.io/api/v1/quote';

async function fetchPortfolioData(email) {
    const response = await axios.get(`http://localhost:5001/portfolio?email=${encodeURIComponent(email)}`);
    return response.data;
}

// Function to extract stock ticker name using Together API
async function extractStockTicker(lastMessage) {
    const tickerExtractionMessages = [
        {
            role: 'system',
            content: 'Extract the stock ticker name from the following message if it exists and put it in {} to extract easily.',
        },
        {
            role: 'user',
            content: lastMessage,
        },
    ];

    const response = await axios.post(
        TOGETHER_API_URL,
        {
            model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
            messages: tickerExtractionMessages,
        },
        {
            headers: {
                'Authorization': `Bearer ${TOGETHER_API_KEY_TICKER}`,
                'Content-Type': 'application/json',
                max_tokens: 8193,
            },
        }
    );

    const tickerContentRaw = response.data.choices[0]?.message?.content || '';
    const tickerMatch = tickerContentRaw.match(/\{(.*?)\}/);
    return tickerMatch ? tickerMatch[1] : 'No ticker found';
}

// Function to fetch stock data using Finnhub API
async function fetchStockData(tickerContent) {
    const response = await axios.get(`${STOCK_SEARCH_API_URL}?symbol=${tickerContent}&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg`);
    const stockData = response.data;

    const readableTimestamp = new Date(stockData.t * 1000).toLocaleString();

    return {
        currentPrice: stockData.c,
        change: stockData.d,
        percentChange: stockData.dp,
        highPrice: stockData.h,
        lowPrice: stockData.l,
        openPrice: stockData.o,
        previousClosePrice: stockData.pc,
        time: readableTimestamp,
    };
}

// Function to call Together API with portfolio and stock data
async function callTogetherAPI(messages, portfolioData, stockDataWithMeaning, tickerContent) {
    const formattedMessages = [
        {
            role: 'system',
            content: `These are my portfolio stocks, answer based on this if asked about these stocks which are in my portfolio or answer without mentioning my portfolio - ${JSON.stringify(portfolioData)}`,
        },
        {
            role: 'system',
            content: `Use this data for ${tickerContent} to analyze and answer - ${JSON.stringify(stockDataWithMeaning)}`,
        },
        ...messages.map((message) => ({
            role: message.role || 'user',
            content: message.content,
        })),
    ];

    const response = await axios.post(
        TOGETHER_API_URL,
        {
            model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
            messages: formattedMessages,
        },
        {
            headers: {
                'Authorization': `Bearer ${TOGETHER_API_KEY_PORTFOLIO}`,
                'Content-Type': 'application/json',
                max_tokens: 8193,
            },
        }
    );

    return response.data.choices[0]?.message?.content || 'No response from assistant.';
}

// Chat API logic
router.post('/chat', async (req, res) => {
    const { messages, email } = req.body;

    try {
        const portfolioData = await fetchPortfolioData(email);
        console.log('Portfolio data:', portfolioData);

        const lastMessage = messages[messages.length - 1]?.content || '';

        const tickerContent = await extractStockTicker(lastMessage);
        console.log('Extracted stock ticker:', tickerContent);

        let stockDataWithMeaning = null;
        if (tickerContent !== 'No ticker found') {
            stockDataWithMeaning = await fetchStockData(tickerContent);
            console.log('Stock data with meaning:', stockDataWithMeaning);
        } else {
            console.log('No valid ticker found to fetch stock data.');
        }

        const content = await callTogetherAPI(messages, portfolioData, stockDataWithMeaning, tickerContent);
        res.json({
            content,
            portfolio: portfolioData || null,
            extractedTicker: tickerContent,
            stockData: stockDataWithMeaning || null,
        });
    } catch (error) {
        console.error('Error in /api/chat:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to process the request. LLM currently not available' });
    }
});

module.exports = router;