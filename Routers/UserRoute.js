const express = require('express');
const UserRoute = express.Router();
const UserModal = require('../Modals/User');
const bodyparser = require('body-parser');
const bcrypt  = require('bcrypt');
const {HandlError, getToken,checkuser} = require('../Controllers/AuthController');
const jwt = require('jsonwebtoken');

// 953077210388-hrrqunh00aerbng60d4firkbdh2954q3.apps.googleusercontent.com
// CPAIK-KgtMpTr2_3AMXWV7xG

// Function to verify the error in login Form
UserRoute.use(bodyparser.json());

 UserRoute.post('/login', async (req , res) => {
    const  userSign = {
        email : req.body.email,
        password : req.body.password,
        compte : req.body.compte,
        remembre : req.body.remembre,
        withGoogle : req.body.withGoogle
     }
     console.log(userSign);
     try{
        const user = await UserModal.login(userSign.email,userSign.password,userSign.compte,userSign.withGoogle);
        if (userSign.remembre) {
            const token = getToken(user._id);
            res.cookie('jwt' , token,{
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
        res.cookie('jwt' , token,{
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

module.exports = UserRoute;