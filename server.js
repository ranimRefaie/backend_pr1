require('dotenv').config()

const express = require('express')
const session = require('express-session');
const cors = require('cors');
const mongoose = require ('mongoose')
const Routes = require('./routes/Routes')

// express app
const app = express()


// middleware 
app.use (express.json())

app.use(cors());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
//session
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
   /* cookie: {
        secure: false, 
        //maxAge: 1000 * 60 * 1000 // 5 minutes (or as needed)
    }*/
}));

// routs
app.use('/api', Routes)

//connect to database
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
    console.log('Connected to DB & Listening on port', process.env.PORT)
    })
})
.catch((error) => {
    console.log(error)
})


