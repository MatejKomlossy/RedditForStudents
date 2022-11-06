const express = require("express");
const session = require('express-session');
const {student} = require("./student/student");
const app = express();
app.use(express.json());     // midware req.body

const oneDay = 1000 * 60 * 60 * 24;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

//session middleware
app.use(session({
    secret: "secret",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// app.use(session({
//     secret: 'secret', // TODO maybe it will need change
//     resave: true,
//     saveUninitialized: true
// }));
student.initAppServices(app);

// app.use(function(req, res, next){
//     res.locals.session = req.session;
//     console.log(res.locals.session)
//     next();
// });

const PORT = 5000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));