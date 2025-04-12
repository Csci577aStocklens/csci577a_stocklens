const express = require('express');
const app = express();
const port = 5001;

const mongoose=require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const url1="mongodb://localhost:27017/stocks"; //"mongodb://localhost/bank";

const router = express.Router();

//const fetch = require('node-fetch');
var path = require('path');


//mongodb+srv://varunakrishna1:<db_password>@cluster0.1gvny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect("mongodb+srv://varunakrishna1:mongodbatlas@cluster0.1gvny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
});


const con=mongoose.connection;
con.on('open',()=>{
  console.log("connected");
});

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


app.use(express.json());


var cors = require ('cors')
app.use (cors())


const axios = require('axios');


// User Schema
const userSchema = new mongoose.Schema({
    username: { 
      type: String, 
      required: true, 
      unique: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  });
  
const User = mongoose.model('User', userSchema);
  
  // JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  
  // Routes
  // Register new user
app.post('/api/signup', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Username or email already exists' 
        });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      const user = new User({
        username,
        email,
        password: hashedPassword
      });
  
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Login user
app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Create JWT token
      const payload = {
        user: {
          id: user.id,
          username: user.username
        }
      };
  
      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Protected route example
app.get('/api/user', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (error) {
      console.error('User fetch error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Middleware to validate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Access denied' });
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user.user;
      next();
    });
  }
const stock_watch=require("./routers/stocks_watch");
app.use("/stocks_watch",stock_watch);



const balance=require("./routers/balance");
app.use("/balance",balance);


const portfolio=require("./routers/portfolio");
app.use("/portfolio",portfolio);



app.get("/hrs_stk",(req,res)=>{

console.log(req.query.dt2+"/"+req.query.dt1)
url="https://api.polygon.io/v2/aggs/ticker/"+req.query.name.toUpperCase() +"/range/1/hour/"+req.query.dt1+"/"+req.query.dt2+"?adjusted=true&sort=asc&apiKey=25co1PGn9EK901ClTpj87TticB9GbSKH"
//url="https://api.polygon.io/v2/aggs/ticker/"+req.query.name.toUpperCase() +"/range/1/hour/2024-03-07/2024-03-08?adjusted=true&sort=asc&apiKey=25co1PGn9EK901ClTpj87TticB9GbSKH"

axios.get(url)
        .then(response => {
        console.log(response.data);
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });

});


app.get("/peers",(req,res) =>{
    console.log(req.query.name )
    url="https://finnhub.io/api/v1/stock/peers?symbol="+req.query.name +"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        console.log(response.data);
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
    //return res.send("Hi")//requests.get(url).content;
}  );

app.get("/comp_ear",(req,res) =>{
    console.log(req.query.name )
    url="https://finnhub.io/api/v1/stock/earnings?symbol="+req.query.name +"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        console.log(response.data);
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
    //return res.send("Hi")//requests.get(url).content;
}  );

app.get("/stockinfo",(req,res) =>{
    console.log(req.query.name )
    url="https://finnhub.io/api/v1/stock/profile2?symbol="+req.query.name +"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        console.log(response.data);
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
    //return res.send("Hi")//requests.get(url).content;
}  );


app.get("/summary_info",(req,res) =>{
    console.log(req.query.name )
    url="https://finnhub.io/api/v1/quote?symbol="+req.query.name+"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        console.log(response.data);
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
    //return res.send("Hi")//requests.get(url).content;
}  );

app.get("/autocomp",(req,res) =>{
    console.log(req.query.name )
    url="https://finnhub.io/api/v1/search?q="+req.query.name+"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        console.log(response.data);
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
    //return res.send("Hi")//requests.get(url).content;
}  );
app.get("/recom",(req,res) =>{
    console.log(req.query.name )
    url="https://finnhub.io/api/v1/stock/recommendation?symbol="+req.query.name+"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        console.log(response.data);
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
    //return res.send("Hi")//requests.get(url).content;
}  );

   
     
app.get("/charts_d",(req,res) =>{
    console.log(req.query.name);
    let currentDate = new Date();
    let futureDate = new Date(currentDate);
    futureDate.setFullYear(currentDate.getFullYear() - 2);
    let to = currentDate.toISOString().split('T')[0];
    let from_d = futureDate.toISOString().split('T')[0];
    url="https://api.polygon.io/v2/aggs/ticker/"+req.query.name.toUpperCase() + "/range/1/day/"+from_d+"/" + to +"?adjusted=true&sort=asc&apiKey=ctO8iVF_Gi19afBovU1ZSr6UIxqt8Fr3"
    console.log(to,from_d,"sds",url);
    axios.get(url)
        .then(response => {
        console.log(response);
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
    //return res.send("Hi")//requests.get(url).content;
}  );

 
       
app.get("/news",(req,res) =>{
    console.log(req.query.name )
    /*let yourDate = new Date()
    to=yourDate.toISOString().split('T')[0]
     //datetime.datetime.now().strftime('%Y-%m-%d')
    let p=to.setDate(to.getDate() + 30)
    console.log(p)
    from_d=p.toISOString().split('T')[0];
    console.log(to,from_d)*/
    
    let currentDate = new Date();
    let futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() - 7);
    let to = currentDate.toISOString().split('T')[0];
    let from_d = futureDate.toISOString().split('T')[0];
    console.log(to,from_d)
    url="https://finnhub.io/api/v1/company-news?symbol="+req.query.name + "&from="+from_d+"&to=" + to +"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    axios.get(url)
        .then(response => {
        console.log(response.data);
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
    //return res.send("Hi")//requests.get(url).content;
}  );

 
app.get("/insider",(req,res) =>{
    console.log(req.query.name )
    let yourDate = new Date()
    let to=yourDate.toISOString().split('T')[0]
    url="https://finnhub.io/api/v1/stock/insider-sentiment?symbol="+req.query.name + "&from="+"2022-01-01"+"&token=cms9s29r01qlk9b15gk0cms9s29r01qlk9b15gkg"
    console.log(url)
    axios.get(url)
        .then(response => {
        console.log(response.data);
        return res.send(response.data)
            })
    .catch(error => {
            console.log(error);
    });
    //return res.send("Hi")//requests.get(url).content;
}  );

/*
app.use(express.static(path.join('./dist/stock-lens-ui/browser')));

app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, './dist/stock-lens-ui/browser', 'index.html'));
});
*/





// Serve static files for both applications
app.use('/auth', express.static(path.join(__dirname, './frnt/frnt/dist/frnt/browser/browser')));
app.use('/app', express.static(path.join(__dirname, './dist/stock-lens-ui/browser/browser')));

// Default route directs to auth app
app.get('/', (req, res) => {
  res.redirect('/auth');
});

// Auth app routes
app.get('/auth/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './frnt/frnt/dist/frnt/browser/browser', 'index.html'));
});

// Stock lens app routes
app.get('/app/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/stock-lens-ui/browser/browser', 'index.html'));
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

