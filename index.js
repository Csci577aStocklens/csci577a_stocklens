const express = require('express');
const app = express();
const port = 5001;

const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const url1 = "mongodb://localhost:27017/stocks";
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect("mongodb+srv://adityasi:adityasinha@cluster0.3qhwgvc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
});

const con = mongoose.connection;
con.on('open', () => {
    console.log("Connected to MongoDB");
});

// Middleware setup
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser());

const axios = require('axios');

const stock_watch=require("./routers/stocks_watch");
app.use("/stocks_watch",stock_watch);

const balance=require("./routers/balance");
app.use("/balance",balance);

const portfolioRouter = require('./routers/portfolio');
app.use("/portfolio",portfolioRouter);

const usersRouter = require('./routers/users');
app.use('/api', usersRouter);

const recommendationsRouter = require('./routers/recommendations');
app.use('', recommendationsRouter);

const chatRouter = require('./routers/chat');
app.use('/api', chatRouter);


app.get("/hrs_stk",(req,res)=>{

url="https://api.polygon.io/v2/aggs/ticker/"+req.query.name.toUpperCase() +"/range/1/hour/"+req.query.dt1+"/"+req.query.dt2+"?adjusted=true&sort=asc&apiKey=25co1PGn9EK901ClTpj87TticB9GbSKH"


axios.get(url)
        .then(response => {
        
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });

});

app.get("/peers",(req,res) =>{
 
    url="https://finnhub.io/api/v1/stock/peers?symbol="+req.query.name +"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
}  );

app.get("/comp_ear",(req,res) =>{
   
    url="https://finnhub.io/api/v1/stock/earnings?symbol="+req.query.name +"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
}  );

app.get("/stockinfo",(req,res) =>{
   
    url="https://finnhub.io/api/v1/stock/profile2?symbol="+req.query.name +"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
}  );

app.get("/summary_info",(req,res) =>{
    
    url="https://finnhub.io/api/v1/quote?symbol="+req.query.name+"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
}  );

app.get("/autocomp",(req,res) =>{
   
    url="https://finnhub.io/api/v1/search?q="+req.query.name+"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
}  );
app.get("/recom",(req,res) =>{
    
    url="https://finnhub.io/api/v1/stock/recommendation?symbol="+req.query.name+"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
}  );

   
     
app.get("/charts_d",(req,res) =>{
   
    let currentDate = new Date();
    let futureDate = new Date(currentDate);
    futureDate.setFullYear(currentDate.getFullYear() - 2);
    let to = currentDate.toISOString().split('T')[0];
    let from_d = futureDate.toISOString().split('T')[0];
    url="https://api.polygon.io/v2/aggs/ticker/"+req.query.name.toUpperCase() + "/range/1/day/"+from_d+"/" + to +"?adjusted=true&sort=asc&apiKey=ctO8iVF_Gi19afBovU1ZSr6UIxqt8Fr3"
  
    axios.get(url)
        .then(response => {
       
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
}  );

       
app.get("/news",(req,res) =>{
    
    
    let currentDate = new Date();
    let futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() - 7);
    let to = currentDate.toISOString().split('T')[0];
    let from_d = futureDate.toISOString().split('T')[0];
    
    url="https://finnhub.io/api/v1/company-news?symbol="+req.query.name + "&from="+from_d+"&to=" + to +"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
}  );

 
app.get("/insider",(req,res) =>{
    
    let yourDate = new Date()
    let to=yourDate.toISOString().split('T')[0]
    url="https://finnhub.io/api/v1/stock/insider-sentiment?symbol="+req.query.name + "&from="+"2022-01-01"+"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
   
    axios.get(url)
        .then(response => {
       
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
}  );

// Serve login page first (no auth required)
app.get('/login.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'login.html'));
});

// Authentication middleware
const checkAuth = async (req, res, next) => {
   
    
    // Skip auth check only for specific paths
    if (req.path === '/login.html' || 
        req.path === '/api/login' || 
        req.path === '/api/signup' ||
        req.path === '/api/logout') {
       
        return next();
    }

    const authToken = req.cookies?.authToken;
    
    
    if (!authToken) {
       
        return res.redirect('/login.html');
    }

    try {
        // Find user by token
        const user = await User.findOne({ authToken });
        if (!user) {
            
            // Clear invalid token and redirect to login
            res.clearCookie('authToken');
            res.clearCookie('userData');
            return res.redirect('/login.html');
        }
        
        req.user = user;
        next();
    } catch (error) {
        
        res.redirect('/login.html');
    }
};

// Protected root route
app.get('/', checkAuth, (req, res) => {
    res.sendFile(path.resolve(__dirname, './public', 'index.html'));
});

// Serve static files (after auth check)
app.use(express.static(path.join('./dist/stock-lens-ui/browser')));

// Catch-all route for Angular routing (after auth check)
app.get('*', checkAuth, (req, res) => {
    res.sendFile(path.resolve(__dirname, './dist/stock-lens-ui/browser', 'index.html'));
});

// Signup route
app.post('/api/signup', async (req, res) => {
    try {
        
        const { email, password, name } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate auth token
        const authToken = Math.random().toString(36).substring(2);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name: name || '',
            authToken: authToken,
            createdAt: new Date()
        });

        await newUser.save();

        // Set cookies
        res.cookie('authToken', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.cookie('userData', JSON.stringify({
            email: newUser.email,
            name: newUser.name
        }), {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({ 
            success: true,
            message: 'User created successfully',
            user: {
                email: newUser.email,
                name: newUser.name
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating user',
            error: error.message 
        });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate new auth token
        const authToken = Math.random().toString(36).substring(2);
        
        // Update user's auth token and last login
        user.authToken = authToken;
        user.lastLogin = new Date();
        await user.save();

        // Set cookies
        res.cookie('authToken', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.cookie('userData', JSON.stringify({
            email: user.email,
            name: user.name
        }), {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ 
            success: true, 
            user: {
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout route
app.post('/api/logout', async (req, res) => {
    const token = req.cookies?.authToken;
    if (token) {
        try {
            // Clear auth token from user document
            await User.findOneAndUpdate(
                { authToken: token },
                { $unset: { authToken: 1 } }
            );
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    res.clearCookie('authToken');
    res.clearCookie('userData');
    res.redirect('/login.html');
});

// API endpoint to get current user from cookie
app.get('/api/current-user', (req, res) => {
    const userDataCookie = req.cookies?.userData;
    if (!userDataCookie) {
        return res.status(401).json({ message: 'No user data found' });
    }
    
    try {
        const userData = JSON.parse(userDataCookie);
        // Update the config file with the current user's email
        const fs = require('fs');
        const configPath = path.resolve(__dirname, 'config.js');
        const configContent = `// Configuration file for the application
const config = {
    // Current user ID - change this to switch users
    currentUserId: "${userData.email}"
};

module.exports = config;`;
        
        fs.writeFileSync(configPath, configContent);
        
        res.json({ 
            success: true, 
            user: userData 
        });
    } catch (error) {
        console.error('Error parsing user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });