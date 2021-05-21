const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparser = require('body-parser');
// UserRoute
const  UserRoute = require('./Routers/UserRoute')
const MarcheRouter = require('./Routers/MarcheRouter');
const cookieParser = require('cookie-parser');
const InitRoute = require('./Routers/LoadingInitRoute');

// connect Server
const app = express();

// cors 
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.listen(4000,()=> {
    console.log('server Connection');
});

app.get('/indexe' , (req , res) => {
  res.send({age : 19});
})

//cookies 
app.use(cookieParser());

// test cookies
app.get('/set-cookies', (req, res) => {
    console.log('cookies');

    // res.setHeader('Set-Cookie', 'newUser=true');
    
    res.cookie('newUser', false);
    res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
    res.send('you got the cookies!');
  
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
mongoose.connect("mongodb://localhost/Projet2cp",{useUnifiedTopology : true , useNewUrlParser : true});
mongoose.connection.once('open',()=> {
    console.log('DataBase connection');
});

// use Routers
app.use(UserRoute);
app.use('/dossiers',MarcheRouter);
app.use(InitRoute);

