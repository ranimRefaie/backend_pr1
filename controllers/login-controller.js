const { Student, Quiz, TestResult, BehavioralNote, Absence, Announcement } = require('../models/studentModel')
//const session = require('express-session');
const jwt = require('jsonwebtoken');

const LogIn = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch the user based on username
        const user = await Student.findOne({ username });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ message: 'Login failed. Username does not exist' });
        }

        // Comparison to the password
        if (password !== user.Password) {
            return res.status(400).json({ message: 'Login failed. Incorrect Password' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET, // Make sure to set this in your environment variables
            { expiresIn: '1h' } // Set token expiration time
        );

        // Successful login
        const userRole = user.isAdmin ? 'Admin' : 'Student';
        res.json({
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                role: userRole,
                fullName: user.fullName,
            },
        });
    } catch (error) {
        res.status(401).json({ message: 'Server error', error: error.message });
    }
};






/*const LogIn = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch the user based on username
        const user = await Student.findOne({ username });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

       // Comparison to the password
        if (password !== user.Password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

       // Set session user info
        req.session.userId = user._id;
        req.session.isAdmin = user.isAdmin;

        // Successful login
        const userRole = user.isAdmin ? 'Admin' : 'Student';
        res.json({
            message: 'Login successful',
            user: {
                username: user.username,
                role: userRole,
                fullName: user.fullName,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};*/

module.exports = LogIn;