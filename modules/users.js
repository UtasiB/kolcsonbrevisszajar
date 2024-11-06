const express = require('express');
var CryptoJS = require("crypto-js");
const router = express.Router();
const db = require('./database');
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

router.post('/reg', (req, res) => {
    
    let { name, email, passwd, confirm } = req.body;
    let today = new Date();
    if (!name || !email || !passwd || !confirm) {
        req.session.msg = 'Missing data!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return
    }

    if (passwd != confirm){
        req.session.msg = 'Passwords dont match!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return
    }

    if (!passwd.match(passwdRegExp)){
        req.session.msg = 'Password is weak!';
        req.session.severity = 'danger';
        res.redirect('/reg'); 
        return
    }

    db.query(`SELECT * FROM users WHERE email=?`, [email], (err, results)=>{
        if (err){
            req.session.msg = 'This e-mail already registered!';
            req.session.severity = 'danger';
            res.redirect('/reg');
            return
        }

        db.query(`INSERT INTO users (ID, name, email, passwd, role, membership_date) VALUES("", ?, ?, SHA1(?), 'user', ?)`, 
            [name, email, passwd, today], (err, results)=>{
            if (err){
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/reg');
                return
            }
            req.session.msg = 'User registered!';
            req.session.severity = 'success';
            res.redirect('/');
            return
        })
    });

});



module.exports = router;