const express = require('express');
var CryptoJS = require("crypto-js");
const router = express.Router();
const db = require('./database');
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;



module.exports = router;