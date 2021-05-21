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
                if (JSON.stringify(user.compte) == JSON.stringify(compte)) {
                    return user
                }
                throw Error('incorrect copmte');
            }
            throw Error('incorrect Password');
        }
        throw Error ('incorrect Email');
    }
    else {
        console.log(email);
        console.log(true);
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

