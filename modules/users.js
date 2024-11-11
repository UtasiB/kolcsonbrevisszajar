const express = require('express');
var CryptoJS = require("crypto-js");
const router = express.Router();
const db = require('./database');
const ejs = require('ejs');
const moment = require('moment');

const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// User registration route
router.post('/reg', (req, res) => {
    let { name, email, passwd, confirm } = req.body;
    let today = new Date();
    if (!name || !email || !passwd || !confirm) {
        req.session.msg = 'Missing data!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return;
    }

    if (passwd !== confirm) {
        req.session.msg = 'Passwords don\'t match!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return;
    }

    if (!passwd.match(passwdRegExp)) {
        req.session.msg = 'Password is weak!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return;
    }

    db.query(`SELECT * FROM users WHERE email=?`, [email], (err, results) => {
        if (err) {
            req.session.msg = 'This e-mail is already registered!';
            req.session.severity = 'danger';
            res.redirect('/reg');
            return;
        }

        db.query(`INSERT INTO users (ID, name, email, passwd, role, membership_date) VALUES("", ?, ?, SHA1(?), 'user', ?)`, 
            [name, email, passwd, today], (err, results) => {
                if (err) {
                    req.session.msg = 'Database error!';
                    req.session.severity = 'danger';
                    res.redirect('/reg');
                    return;
                }
                req.session.msg = 'User registered!';
                req.session.severity = 'success';
                res.redirect('/');
            });
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

router.post('/delete/:id', (req, res) => {
    db.query(`DELETE FROM users WHERE ID = ?`, [req.params.id], (err, results) => {
        if (err) {
            req.session.msg = 'Database error!';
            req.session.severity = 'danger';
            res.redirect('/');
            return;
        }
        if (results.affectedRows === 0) {
            req.session.msg = 'Invalid credentials!';
            req.session.severity = 'danger';
            res.redirect('/');
            return;
        }
        req.session.msg = 'User deleted!';
        req.session.severity = 'info';
        res.redirect('/users');
    });
});

router.get('/edit/:id', (req, res) => {
    if (req.session.isLoggedIn) {
        db.query(`SELECT * FROM users WHERE ID = ?`, [req.params.id], (err, results) => {
            if (err || results.length === 0) {
                req.session.msg = 'User not found!';
                req.session.severity = 'danger';
                res.redirect('/users');
                return;
            }
            results.forEach(item => {
                item.membership_date = moment(item.membership_date).format('YYYY.MM.DD.');
                if (item.membership_date) {
                    item.membership_date= moment(item.membership_date).format('YYYY.MM.DD.');
                }
            });
            ejs.renderFile('./views/editUser.ejs', { session: req.session, user: results[0] }, (err, html) => {
                if (err) {
                    console.log(err);
                    return;
                }
                res.send(html);
            });
        });
    } else {
        res.redirect('/');
    }
});
router.post('/update/:id', (req, res) => {
    if (req.session.isLoggedIn) {
        const { name, email, role } = req.body;
        db.query(`UPDATE users SET name = ?, email = ?, role = ? WHERE ID = ?`, [name, email, role, req.params.id], (err, results) => {
            if (err) {
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/users');
                return;
            }
            req.session.msg = 'User updated successfully!';
            req.session.severity = 'success';
            res.redirect('/users');
        });
    } else {
        res.redirect('/');
    }
});


module.exports = router;