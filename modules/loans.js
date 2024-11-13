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

        if(req.session.userRole === "admin") {
        } else {
            db.query(`SELECT * FROM rentals WHERE ID = ? AND userID = ?`, [rentalID, req.session.userID], (err, results) => {
                if (err || results.length === 0) {
                    req.session.msg = 'You do not have permission to return this rental.';
                    req.session.severity = 'danger';
                    return res.redirect('/listing');
                }
            });
        }

        db.query(`UPDATE rentals SET return_date = ? WHERE ID = ?`, [new Date(), rentalID], (err, result) => {    
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
                req.session.msg = 'Item returned successfully!';
                req.session.severity = 'success';
                if(req.session.userRole == "admin"){
                    res.redirect('/loans');
                }
                else{
                    res.redirect('/loan');
                }          

            });
        });
    } else {   
        res.redirect('/');
    }
        return;
    }   
)

router.post('/hozzaadas', (req, res) => {
    if (req.session.isLoggedIn) {
        let title = req.body.title;
        let type = req.body.type;
        if(title == '' || type == ''|| type == 'Tipus választása:') {
            req.session.msg = 'Please fill out all fields!';
            req.session.severity = 'danger';
            res.redirect('/loans');
            return;
        }

        db.query(`INSERT INTO items (title, type, available) VALUES (?, ?, 1)`, [title, type], (err, result) => {
            if (err) {
                console.log(err);
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/loans');
                return;
            }
            req.session.msg = 'Item added!';
            req.session.severity = 'success';
            res.redirect('/loans');
        });
        return;
    }
    res.redirect('/');

});

router.post('/delete/:id', (req, res) => {
    if (req.session.isLoggedIn) {
        let rentalID = req.params.id;
        let userID = req.session.userID;

        db.query(`SELECT itemID FROM rentals WHERE ID = ? AND userID = ?`, [rentalID, userID], (err, results) => {
            if (err) {
                console.log(err);
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                return res.redirect('/listing');
            }
            if (results.length === 0) {
                req.session.msg = 'Rental not found or you do not have permission to delete this rental.';
                req.session.severity = 'danger';
                return res.redirect('/listing');
            }

            let itemID = results[0].itemID;

            db.query(`DELETE FROM rentals WHERE ID = ? AND userID = ?`, [rentalID, userID], (err, result) => {
                if (err) {
                    console.log(err);
                    req.session.msg = 'Database error!';
                    req.session.severity = 'danger';
                    return res.redirect('/listing');
                }

            db.query(`UPDATE items SET available = 1 WHERE ID = ?`, [itemID], (err, result) => {
                    if (err) {
                        console.log(err);
                        req.session.msg = 'Database error!';
                        req.session.severity = 'danger';
                        return res.redirect('/listing');
                    }
                    req.session.msg = 'Rental deleted successfully!';
                    req.session.severity = 'success';
                    res.redirect('/listing');
                });
            });
        });
    } else {
        res.redirect('/');
    }
});


module.exports = router;