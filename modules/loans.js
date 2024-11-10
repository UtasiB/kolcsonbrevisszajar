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

router.get('/visszahozatal', (req, res) => {
    if(req.session.isLoggedIn) {
        
        db.query(`UPDATE rentals SET return_date = ? WHERE userID = ?`, [new Date(), req.session.userID], (err, result) => {    
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

});


module.exports = router;