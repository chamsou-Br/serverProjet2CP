const express = require('express');
const cors = require('cors');
const app = express();

const WhiteListe = ['http://localhost:3000'];

const CorsOptionDelegate = (req , cb) => {
    var corsOption;
    if (WhiteListe.indexOf(req.header('Origin')) !== -1 ) {
        corsOption = { origin : true }
    }else {
        corsOption = { origin : false }
    }
    cb(null,corsOption);
}

exports.cors = cors();
exports.corsWithOptions = cors(CorsOptionDelegate);