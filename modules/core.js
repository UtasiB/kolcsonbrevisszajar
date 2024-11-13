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

router.get('/listing', (req, res) => {
    if (req.session.isLoggedIn) {
        db.query('SELECT * FROM items', (err, results) => {
            if (err) {
                console.log(err);
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/');
                return;
            }
            
            ejs.renderFile('./views/listing.ejs', { session: req.session, items: results }, (err, html) => {
                if (err) {
                    console.log(err);
                    return;
                }
                req.session.msg = '';
                res.send(html);
            });
        });
        return;
    }
    res.redirect('/');
});




router.get('/loans', (req, res)=> {
    const query = `
        SELECT rentals.*, items.title, users.name 
        FROM rentals 
        JOIN items ON rentals.itemID = items.ID 
        JOIN users ON rentals.userID = users.ID
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            req.session.msg = 'Database error!';
            req.session.severity = 'danger';
            res.redirect('/');
            return;
        }
        results.forEach(item => {
            item.rental_date = moment(item.rental_date).format('YYYY.MM.DD.');
            if (item.return_date) {
                item.return_date = moment(item.return_date).format('YYYY.MM.DD.');
            }
        });
        ejs.renderFile('./views/loans.ejs', { session: req.session, rentals: results }, (err, html) => {
            if (err) {
                console.log(err);
                return;
            }
            req.session.msg = '';
            res.send(html);
        });
    });
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


router.get('/loan', (req, res) => {
    if (req.session.isLoggedIn) {

        let bookCount = 0;
        let filmCount = 0

        const query = `
            SELECT rentals.*, items.title, items.type
            FROM rentals 
            JOIN items ON rentals.itemID = items.ID 
            WHERE rentals.userID = ?
        `;
        req.session.rentalsID = req.body.ID;
        db.query(query, [req.session.userID], (err, results) => {
            if (err) {
                console.log(err);
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';    
                res.redirect('/');
                return;
            }
            results.forEach(item => {
                item.rental_date = moment(item.rental_date).format('YYYY.MM.DD.');
                if (item.return_date) {
                    item.return_date = moment(item.return_date).format('YYYY.MM.DD.');
                }
                if(item.type == 'könyv'){
                    bookCount++;
                }
                if(item.type == 'film'){
                    filmCount++;
                }
            });


            ejs.renderFile('./views/loan.ejs', { session: req.session, rentals: results, bookCount, filmCount }, (err, html) => {
                if (err) {
                    console.log(err);
                    return;
                }
                req.session.msg = '';
                res.send(html);
            });
        });
       
    
            
        

        return;
    }
    res.redirect('/');
});


router.get('/users', (req, res)=>{
    if (req.session.isLoggedIn){
        db.query(`SELECT * FROM users`, (err, results)=>{
            if (err){
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/listing');
                return
            }
            results.forEach(user => {
                user.membership_date = moment(user.membership_date).format('YYYY.MM.DD.');
            });

            ejs.renderFile('./views/users.ejs', { session: req.session, users: results}, (err, html)=>{
                if (err){
                    console.log(err);
                    return
                }
                req.session.msg = '';
                res.send(html);
            });
            return
        });
       
        return;
        
    }
    res.redirect('/');
});

router.get('/statistics', (req, res)=>{
    if (req.session.isLoggedIn){
            db.query(`
                SELECT users.ID, users.name, COUNT(rentals.userID) AS rentalCount
                FROM users
                JOIN rentals ON users.ID = rentals.userID
                GROUP BY users.ID, users.name
                ORDER BY rentalCount DESC
                LIMIT 10
            `, (err, userResults) => {
                if (err) {
                    console.log(err);
                    req.session.msg = 'Database error!';
                    req.session.severity = 'danger';
                    res.redirect('/');
                    return;
                }

            db.query(`
                SELECT items.ID, items.title, COUNT(rentals.itemID) AS rentalCount
                FROM items
                JOIN rentals ON items.ID = rentals.itemID
                GROUP BY items.ID, items.title
                ORDER BY rentalCount DESC
                LIMIT 10
            `, (err, itemResults) => {
            if (err) {
                console.log(err);
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/');
                return;
            }

            ejs.renderFile('./views/statistics.ejs', { session: req.session, users: userResults, items: itemResults }, (err, html) => {
                if (err) {
                    console.log(err);
                    return;
                }
                req.session.msg = '';
                res.send(html);
            });
            return;
        });
     return;

    });
    return;
    
}
res.redirect('/');
});



module.exports = router;
