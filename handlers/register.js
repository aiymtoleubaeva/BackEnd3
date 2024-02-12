const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const bcrypt = require('bcrypt');

const dbURL = 'mongodb+srv://aiym:aiymaiym@cluster0.ug3bscp.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = client.db('openWeather');
        const usersCollection = db.collection('users');

        const exists = await usersCollection.findOne({ username });
        if (exists) {
            res.status(400).send('invalid data');  
            return;
        }
        const hash = await bcrypt.hash(password, 10);
        if (username == "aiym" && password == "aiym12345") {
            const _ = await usersCollection.insertOne({
                username,
                password: hash,
                isAdmin: true 
            });
        } else {
            const _ = await usersCollection.insertOne({
                username,
                password: hash,
                isAdmin: false 
            });
        }
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Internal Server Error');    
    }
});


router.get('/register', (_, res) => {
    res.render('register');
});


module.exports = router;
