const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const config = require('../config');

// Temporary hardcoded user for development
const DUMMY_USER = {
    id: 'dummy',
    email: 'dummy@example.com'
};

// Get current user
router.get('/current-user', (req, res) => {
    // Get user data from cookie
    const userDataCookie = req.cookies?.userData;
    if (!userDataCookie) {
        return res.status(401).json({ message: 'No user data found' });
    }
    
    try {
        const userData = JSON.parse(userDataCookie);
        
        // Update the config file with the current user's email
        const configPath = path.resolve(__dirname, '..', 'config.js');
        const configContent = `// Configuration file for the application
const config = {
    // Current user ID - change this to switch users
    currentUserId: "${userData.email}"
};

module.exports = config;`;
        
        fs.writeFileSync(configPath, configContent);
        
        // Update the in-memory config
        config.currentUserId = userData.email;
        
        res.json({ 
            success: true, 
            user: userData 
        });
    } catch (error) {
        console.error('Error parsing user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 