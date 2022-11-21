//declaring const express, path, bodyParser, app
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./user');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

const mongo_uri = 'mongodb+srv://mongo:carnival@cluster0.2kd43gq.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongo_uri, function (err) {
    if (err) {
        throw err;
    } else {
        console.log(`successfully connected to ${mongo_uri}`);
    }
});


app.post('/register', function (req, res) {
    const { firstName, lastName, username, password } = req.body;

    const user = new User({ firstName, lastName, username, password });

    user.save(err => {
        if (err) {
            res.status(500).send('error for user registration');
        } else {
            res.status(200).send('registration completed');
        }
    });
});

app.post('/autenticate', function (req, res) {
    const { username, password } = req.body;

    User.findOne({ username }).then(
        (user, err) => {
            if (err) {
                res.status(500).send('some error occured');
            } else if (!user) {
                res.status(500).send('the user does not exist');
            } else {
                if (!bcrypt.compareSync(password, user.password))
                    return res.status(401).send("wrong password");
                return res.status(200).send('autenticated successfully');
            }
        }
    )
});
app.listen(3000, function () {
    console.log('server started');
})
module.exports = app;
