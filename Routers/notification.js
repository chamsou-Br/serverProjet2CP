const express = require('express');
const NotifRouter = express.Router();
const UserModal = require('../Modals/User');
const bodyparser = require('body-parser');


// Function to verify the error in login Form
NotifRouter.use(bodyparser.json());



NotifRouter.post('/chechNotif' ,async (req , res) => {
   const user = await UserModal.findById(req.body.id);
   user.isnotif = false ;
   await user.save();
}
)


module.exports = NotifRouter ;