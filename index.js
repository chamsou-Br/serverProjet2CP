const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');
// UserRoute
const  UserRoute = require('./Routers/UserRoute')
const MarcheRouter = require('./Routers/MarcheRouter');
const cookieParser = require('cookie-parser');
const InitRoute = require('./Routers/LoadingInitRoute');
const NotifRouter = require('./Routers/notification');

// connect Server
const app = express();

//cookies 
app.use(cookieParser());

// cors 
app.use(express.json());
app.use(express.urlencoded({extended : true}));


// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect

  const allowedOrigins = ['http://127.0.0.1:8020', 'http://localhost:3000', 'http://127.0.0.1:9000', 'http://localhost:9000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.listen(4000,()=> {
    console.log('server Connection');
});

app.get('/indexe' , (req , res) => {
  res.send({age : 19});
})



// test cookies
app.get('/set-cookies', (req, res) => {
  
    res.cookie('newUser', 'dfwgxbhcj');
    res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
    res.cookie('chamsou' , "dfvgbdhdbfgj"); 
    console.log(req.cookies.chamsou);
    res.send('you got the cookies! ' + req.cookies.chams);
  });
  
  app.get('/read-cookies', (req, res) => {
  
    const cookies = req.cookies;
    console.log(cookies.newUser);
  
    res.json(cookies);
  
  });



app.post('/index' , (req , res) => {
  console.log(req.body);
  res.send({index : 19})
})

// use Body parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// connect Database
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb+srv://tutorial:V2Io8IQIBZo0rU4v@cluster0.2rpnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useUnifiedTopology : true , useNewUrlParser : true});
mongoose.connection.once('open',()=> {
    console.log('DataBase connection');
});

// use Routers
app.use(UserRoute);
app.use('/dossiers',MarcheRouter);
app.use(InitRoute);
app.use(NotifRouter);

