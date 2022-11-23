const express = require("express");
const session = require('express-session');
const {student} = require("./student/student");
const {post} = require("./post/post");
const DEBUG = true;
if (DEBUG === false) {
    console.log = function(...data) {}
}

const app = express();
app.use(express.json());     // midware req.body
app.use(session({
    secret: 'secret', // TODO maybe it will need change
    resave: true,
    saveUninitialized: true
}));
student.initAppServices(app);
post.initAppServices(app);

const PORT = 5000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));