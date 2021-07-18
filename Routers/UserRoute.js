const express = require('express');
const UserRoute = express.Router();
const UserModal = require('../Modals/User');
const bodyparser = require('body-parser');
const bcrypt  = require('bcrypt');
const {HandlError, getToken,checkuser} = require('../Controllers/AuthController');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const nodemailer= require('nodemailer')

  

const dateNow = new Date().getUTCDate().toString() + '/' + (new Date().getUTCMonth() + 1 ).toString() + '/' + new Date().getUTCFullYear().toString();
// 953077210388-hrrqunh00aerbng60d4firkbdh2954q3.apps.googleusercontent.com
// CPAIK-KgtMpTr2_3AMXWV7xG

// Function to verify the error in login  Form                 user : 'chamseddineb07@gmail.com',pass  :'chamsou2002' 
                
UserRoute.use(bodyparser.json());

UserRoute.post('/forgetPassword', async (req , res) => {
    if (req.body.etape === 0) {
    const user = await UserModal.findOne({email  : req.body.email}) 
    const numbr = Math.floor(Math.random() * 8999) + 1000 ;
    if (user) {
        const transpoter = nodemailer.createTransport({
            service : "gmail" ,
            port : 578,
            secure : false,
            auth : {
                user : 'projett27@gmail.com',
                pass  :'131069aa' 
            }
        })
        var mailOptions = {
            from : 'projett27@gmail.com',
            to : user.email,
            subject : 'Forget Password Esi',
            text : `Bonjeour Mr ${user.username} :) your code is ${numbr} `
        }
        transpoter.sendMail(mailOptions , (err , info ) => {
            if (err) console.log(err , "err")
            else console.log(true);
        })
        res.send({err : false , code : numbr})
    }else res.send({err : true})
    }else {
        const user = await UserModal.findOne({email  : req.body.email}) 
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(req.body.password , salt);
        await user.save();
        res.send(user);
    }
    
})

UserRoute.get('/users', async (req , res )=> {
    const users  = await UserModal.find({});
    res.send(users);
})

UserRoute.post('/notif' , async (req , res) => {
    const user = await UserModal.findById(req.body._id);
    console.log(user)
    user.notification = req.body.notification ;
    user.save();
})

UserRoute.post('/profile', async (req , res) => {
  const user = await  UserModal.findById(req.body.id);
  user.username = req.body.username;
  user.email = req.body.email ;
  await user.save();
  if (req.body.newpassword) {
    const auth = await bcrypt.compare(req.body.ancpassword,user.password)
    if (auth) {
        const salt = await bcrypt.genSalt();
         user.password = await bcrypt.hash(req.body.newpassword , salt);
         await user.save();
         res.send({user : user});
    }else res.send({err : true,user : user});
  }

})

UserRoute.post('/image' ,async (req , res) => {
    const user = await UserModal.findOne({email : req.body.email});
    if (user) {
        user.imageSocial = req.body.imageSocial;
        user.isImageSocial = true ;
        await user.save();
        res.send({user})
    }else res.send({err : true})
})

 UserRoute.post('/login', async (req , res) => {
    const  userSign = {
        email : req.body.email,
        password : req.body.password,
        compte : req.body.compte,
        remembre : req.body.remember,
        withGoogle : req.body.withGoogle,
        imageSocial : req.body.imageSocial ?  req.body.imageSocial : " "
     }
     try{
        const user = await UserModal.login(userSign.email,userSign.password,userSign.compte,userSign.withGoogle,userSign.imageSocial);
        if (userSign.remembre) {
            const token = await getToken(user._id);
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
            compte : req.body.compte,
            dayAjouter : dateNow
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
})

module.exports = UserRoute;