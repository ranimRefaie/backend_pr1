const { Student, Quiz, TestResult, BehavioralNote, Absence, Announcement } = require('../models/studentModel')
const session = require('express-session');


const LogOut = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
              console.log('User logged out.');
                res.redirect(302, '/api/Login'); // Redirect to the homepage or login page


    });
};

module.exports = LogOut;