const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');



const UserSheama = new mongoose.Schema({
    username : {
        type : String , 
        required : [true , 'please enter an username']
    }, 
    email : {
        type : String ,
        required : [true,'Please enter an Email'],
        validate : [isEmail ,'Please enter a valid email'],
        unique : true,
        lowercase : true
    },
    password : {
        type :String,
        required :[true,'Please enter an PassWord'],
        min : [6,'Minimum password length is 6 characters'],
    },
    isImageBuffer : {
        type : Boolean,
        default : false
    },
    img : {
        data : Buffer ,
        ContenttType : String
    },
    service : {
        type : String ,
        required : [true , 'please choose an service']
    },
    compte : {
        type : [String],
        required : [true , 'please choose an compte']
    },
    notification : [{
        typeof : String ,
        date : String,
        notif : String,
        idDossier : String
    }],
    imageSocial  : {
        type : String
    },
    isnotif : {
        type : Boolean,
        default  :false
    }
},{
    timestamps : true
})

UserSheama.statics.login = async(email , password,compte,withGoogle) => {
    if (!withGoogle) {
        const user = await UserModal.findOne({email : email }) ;
        if (user) {
            const auth = await bcrypt.compare(password,user.password)
            if (auth) {
                    return user
            }
            throw Error('incorrect Password');
        }
        throw Error ('incorrect Email');
    }
    else {
        const user = await UserModal.findOne({email : email }) ;
        if (user) {
            return (user);
        }
        throw Error ('incorrect Email');
    }

}

const UserModal = mongoose.model('UserModal' , UserSheama) ;
module.exports = UserModal ;

// login function 

