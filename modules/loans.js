const express = require('express');
const router = express.Router();
const db = require('./database');




router.post('/kolcsonzes', (req, res) => {
    if (req.session.isLoggedIn) {
        let itemID = req.body.cardID;
        let userID = req.session.userID;
        let date = new Date();
        let returnDate = null;
        
        db.query(`INSERT INTO rentals (userID, itemID, rental_date, return_date) VALUES (?, ?, ?, ?)`, [userID, itemID, date, returnDate], (err, result) => {
            if (err) {
                console.log(err);
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/listing');
                return;
            }
        });
        db.query(`UPDATE items SET available = 0 WHERE ID=?`, [itemID], (err, result) => {
            if (err) {
                console.log(err);
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/listing');
                return;
            }
            req.session.msg = 'Loan successful!';
            req.session.severity = 'success';
            res.redirect('/listing');
        });
        return;
    }
    res.redirect('/');
})

router.post('/visszahozatal', (req, res) => {
    if(req.session.isLoggedIn) {

        let itemID = req.body.cardID;
        let rentalID = req.body.rentalID;
        console.log(rentalID);
        db.query(`UPDATE rentals SET return_date = ? WHERE userID = ? and itemID = ? and ID = ?`, [new Date(), req.session.userID, itemID, rentalID], (err, result) => {    
            if (err) {
                console.log(err);
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/loan');
                return;
            }

            db.query(`UPDATE items SET available = 1 WHERE ID=?`, [itemID], (err, result) => {
                if (err) {
                    console.log(err);
                    req.session.msg = 'Database error!';
                    req.session.severity = 'danger';
                    res.redirect('/loan');
                    return;
                }
                req.session.msg = 'Loan successful!';
                req.session.severity = 'success';
                res.redirect('/loan');
            });
        });
        return;
    }   

    res.redirect('/loan');
});

router.post('/hozzaadas', (req, res) => {
    if (req.session.isLoggedIn) {
        let title = req.body.title;
        let type = req.body.type;
        if(title == '' || type == ''|| type == 'Tipus választása:') {
            req.session.msg = 'Please fill out all fields!';
            req.session.severity = 'danger';
            res.redirect('/listing');
            return;
        }

        db.query(`INSERT INTO items (title, type, available) VALUES (?, ?, 1)`, [title, type], (err, result) => {
            if (err) {
                console.log(err);
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/listing');
                return;
            }
            req.session.msg = 'Item added!';
            req.session.severity = 'success';
            res.redirect('/listing');
        });
        return;
    }
    res.redirect('/');

});


module.exports = router;