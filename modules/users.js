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

router.post('/login', (req, res)=>{
    let { email, passwd } = req.body;
    if (!email || !passwd) {
        req.session.msg = 'Missing data!';
        req.session.severity = 'danger';
        res.redirect('/');
        return
    }
console.log(CryptoJS.SHA1(passwd).toString())
    db.query(`SELECT * FROM users WHERE email=? AND passwd=?`, [email, CryptoJS.SHA1(passwd).toString()], (err, results)=>{
        if (err){
            req.session.msg = 'Database error!';
            req.session.severity = 'danger';
            res.redirect('/');
            return
        }
        if (results == 0){
            req.session.msg = 'Invalid credentials!';
            req.session.severity = 'danger';
            res.redirect('/');  
            return
        }
        req.session.msg = 'You are logged in!';
        req.session.severity = 'info';

        req.session.isLoggedIn = true;
        req.session.userID = results[0].ID;
        req.session.userName = results[0].name;
        req.session.userEmail = results[0].email;
        req.session.userRole = results[0].role;

        console.log(req.session);
        res.redirect('/listing');
        return
    });
});

router.get('/logout', (req, res)=>{
    req.session.destroy();
    res.redirect('/');
});



module.exports = router;