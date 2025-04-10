const express = require('express');
const app = express();
const port = 5001;

const mongoose=require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const url1="mongodb://localhost:27017/stocks"; //"mongodb://localhost/bank";

const router = express.Router();

//const fetch = require('node-fetch');
var path = require('path');


// app.use("",express.static(path.join(__dirname, '../StocksFront/stck/dist/stck')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../StocksFront/stck/dist/stck/browser/index.html'));
//   })

/*mongoose.connect(url1, {
    useNewUrlParser: true,
});*/

/*
mongoose.connect("mongodb+srv://vkolla:2nFfUHZt3wArjdVJ@cluster0.dcbkyey.mongodb.net/", {
    useNewUrlParser: true,
});*/

//mongodb+srv://varunakrishna1:<db_password>@cluster0.1gvny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect("mongodb+srv://varunakrishna1:mongodbatlas@cluster0.1gvny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
});


const con=mongoose.connection;
con.on('open',()=>{
  console.log("connected");
});

//2nFfUHZt3wArjdVJ
//usr name : vkolla

//mongodb+srv://vkolla:<password>@cluster0.dcbkyey.mongodb.net/
/*

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://vkolla:<password>@cluster0.dcbkyey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


*/ 

app.use(express.json());


var cors = require ('cors')
app.use (cors())


const axios = require('axios');


/*app.use("",express.static(path.join(__dirname, '../StocksFront/stck/dist/')));

app.get('*', (req, res) => {
    res.sendFile("C:/Users/varun/Desktop/WebTech/Assignments/Assignment3/StocksFront/stck/dist/stck/browser/index.html");     //path.join(__dirname, '../StocksFront/stck/dist/stck/browser/index.html'));
  })*/



const stock_watch=require("./routers/stocks_watch");
app.use("/stocks_watch",stock_watch);



const balance=require("./routers/balance");
app.use("/balance",balance);


const portfolio=require("./routers/portfolio");
app.use("/portfolio",portfolio);


// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });



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


app.use(express.static(path.join('./dist/stock-lens-ui/browser')));

app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, './dist/stock-lens-ui/browser', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

