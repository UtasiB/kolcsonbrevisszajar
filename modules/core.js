const express = require('express');
const ejs = require('ejs');
const { route } = require('./users');
const router = express.Router();
const db = require('./database');
const moment = require('moment');


// Felhasználó funkciók
router.get('/', (req, res) => {
    ejs.renderFile('./views/index.ejs', { session: req.session }, (err, html)=>{
        if (err){
            console.log(err);
            return
        }
        req.session.msg = '';
        res.send(html);
    });
});

router.get('/reg', (req, res) => {
    ejs.renderFile('./views/regist.ejs', { session: req.session }, (err, html)=>{
        if (err){
            console.log(err);
            return
        }
        req.session.msg = '';
        res.send(html);
    });
});

router.get('/listing', (req, res)=>{
    if (req.session.isLoggedIn){
        ejs.renderFile('./views/listing.ejs', { session: req.session}, (err, html)=>{
            if (err){
                console.log(err);
                return
            }
            req.session.msg = '';
            res.send(html);
        });
        return
    }
    res.redirect('/');
});

router.get('/loan', (req, res)=>{
    if (req.session.isLoggedIn){

       
        ejs.renderFile('./views/loan.ejs', { session: req.session, results, total, events, labels, datas }, (err, html)=>{
            if (err){
                console.log(err);
                return
            }
            req.session.msg = '';
            res.send(html);
        });
        return
        
    }
    res.redirect('/');
});


router.get('/logout', (req, res)=>{

    req.session.isLoggedIn = false;
    req.session.userID = null;
    req.session.userName = null;
    req.session.userEmail = null;
    req.session.userRole = null;
    req.session.msg = 'You are logged out!';
    req.session.severity = 'info';
    res.redirect('/');

});

//Admin funkciók

router.get('/loans', (req, res)=>{
    if (req.session.isLoggedIn){

       
        ejs.renderFile('./views/loans.ejs', { session: req.session, results, total, events, labels, datas }, (err, html)=>{
            if (err){
                console.log(err);
                return
            }
            req.session.msg = '';
            res.send(html);
        });
        return
        
    }
    res.redirect('/');
});


router.get('/users', (req, res)=>{
    if (req.session.isLoggedIn){

       
        ejs.renderFile('./views/users.ejs', { session: req.session, results, total, events, labels, datas }, (err, html)=>{
            if (err){
                console.log(err);
                return
            }
            req.session.msg = '';
            res.send(html);
        });
        return
        
    }
    res.redirect('/');
});



module.exports = router;
