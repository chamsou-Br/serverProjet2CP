const express = require("express");
const InitRoute = express.Router();
const UserModadl = require('../Modals/User');
const {checkuser} = require('../Controllers/AuthController');

InitRoute.get('/loadingInit' , checkuser);

module.exports = InitRoute;