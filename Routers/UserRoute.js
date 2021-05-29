const express = require('express');
const UserRoute = express.Router();
const UserModal = require('../Modals/User');
const bodyparser = require('body-parser');
const bcrypt  = require('bcrypt');
const {HandlError, getToken,checkuser} = require('../Controllers/AuthController');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


// 953077210388-hrrqunh00aerbng60d4firkbdh2954q3.apps.googleusercontent.com
// CPAIK-KgtMpTr2_3AMXWV7xG

// Function to verify the error in login Form
UserRoute.use(bodyparser.json());

 UserRoute.post('/login', async (req , res) => {
    const  userSign = {
        email : req.body.email,
        password : req.body.password,
        compte : req.body.compte,
        remembre : req.body.remember,
        withGoogle : req.body.withGoogle
     }
     res.cookie('chamsou' , 'chamsou');
     try{
        const user = await UserModal.login(userSign.email,userSign.password,userSign.compte,userSign.withGoogle);
        res.cookie('chahinda' , 'chamsou');
        if (userSign.remembre) {
            const token = await getToken(user._id);
            console.log("cookies")
            res.cookie('user_projet_2cp' , token,{
                httpOnly : true ,        
                maxAge : 12 * 30 * 24 * 3600 * 1000,
            });
        }
        res.status(201).json({user :user,existe : true});
     }
     catch(e){
        const err = HandlError(e);
        res.json({err});
     }
 });

UserRoute.post('/registre',async (req , res) => {
    const salt = await bcrypt.genSalt();
    let password = null;
    if (req.body.password ) {
         password = await bcrypt.hash(req.body.password , salt);
    }   
    try{
        if ( req.body.password.length < 6) {
            throw Error('password min length')
        }
        else {
        const newuser = await UserModal.create({
            username : req.body.username ,
            password : password,
            email : req.body.email,
            service : req.body.service,
            compte : req.body.compte
        });
        newuser.password = password;
        newuser.save();
        const token = getToken(newuser._id);
        res.cookie('user_projet_2cp' , token,{
            httpOnly : true ,
            maxAge : 12 * 30 * 24 * 3600 * 1000,
        })
        res.status(201).json({user : newuser});
        }
    }catch(e){
        const err = HandlError(e);
        res.json({err});
    }

})

UserRoute.get('/checkUser' ,async (req  , res) => {
    try {
        const token = (req.cookies.user_projet_2cp ) 
        if (token) {
            jwt.verify(token,"projet 2cp N 27",async (err , encoded) => {
                if (err) {
                    res.send({existe : false})
                }
                if (encoded) {
                    const user = await UserModal.findById(encoded.id);
                    if (user) {
                        res.send({existe : true , user : user }) ;
                    }
                    
                }
            })
        }
        else{ res.send({existe : false})}

    }catch(e) {
        res.send({existe : true , user : user })
        console.log(e.message)
    }
  
})

UserRoute.get('/logout'  , (req , res) => {
    res.clearCookie('user_projet_2cp')
    console.log('deconexion')
    res.send(req.cookies.chamsou);
})

module.exports = UserRoute;