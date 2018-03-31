const User = require('../models/user');


module.exports = (router) => {

    router.post('/register', (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, msg: 'You must provide e-mail.' })
        } else {
            if (!req.body.username) {
                res.json({ success: false, msg: 'You must provide a username.' })
            } else {
                if (!req.body.password) {
                    res.json({ success: false, msg: 'You must provide a password.' })
                } else {
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });

                    // Save user to database
                    user.save((err) => {
                        // Check if error occured
                        if (err) {
                            // Check if error is an error indicating duplicate account
                            if (err.code === 11000) {
                                res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
                            } else {
                                // Check if error is a validation rror
                                if (err.errors) {                                    
                                    if (err.errors.email) { // Check if validation error is in the email field
                                        res.json({ success: false, message: err.errors.email.message }); // Return error
                                    } else if (err.errors.username) { // Check if validation error is in the username field
                                        res.json({ success: false, message: err.errors.username.message }); // Return error
                                    } else if (err.errors.password) { // Check if validation error is in the password field
                                        res.json({ success: false, message: err.errors.password.message }); // Return error
                                    } else {
                                        res.json({ success: false, message: err }); // Return any other error not already covered
                                    }
                                } else {
                                    res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                                }
                            }
                        } else {
                            res.json({ success: true, message: 'User registered!' }); // Return success
                        }
                    });
                }
            }
        }
    });

    return router;
}