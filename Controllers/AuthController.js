const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const UserModal = require('../Modals/User');

const checkuser =  (req , res , next) => {
    const token = req.cookies.jwt ;
    if (token) {
        jwt.verify(token,"projet 2cp N 27",async (err , encoded) => {
            if (err) {
                throw Error('error in JWT');
            }
            if (encoded) {
                const user = await UserModal.findById(encoded.id);
                res.send({existe : true , user : user }) ;
            }
        })
    }
    else res.send({existe : false})
}


const getToken = (id) => {
   return jwt.sign({id} , "projet 2cp N 27" , {
        expiresIn : 3 * 60 * 60 * 24,
    })
};

const HandlError = (err) => {
    let errors = { email: null, password: null,username : null , compte : null,service : null,service : null };
    if (err.code === 11000) {
        if (err.keyValue.email) {
            errors.email = 'that email is already registered';
        }
        else {
            errors.username = 'that Username is already registered';
        }
        return errors;
    }
    if (err.message.includes('UserModal validation failed')) {
        console.log('yes');
        console.log(err.message);
        Object.values(err.errors).forEach(({ properties }) => {
          console.log(err.errors);
          errors[properties.path] = properties.message;
        });
    }
    if (err.message === 'incorrect Email') {
        errors.email = 'that Email is not registred !'
      }
      if (err.message === 'incorrect Password') {
        errors.password = 'that password is incorrect'
      }
    if (err.message === 'incorrect copmte') {
        errors.compte = 'u can\'t access in this compte -only- '
    }
    if (err.message === 'password min length') {

        errors.password = "Minimum password length is 6 characters"
    }
    return errors


}

module.exports = {checkuser,getToken ,HandlError}