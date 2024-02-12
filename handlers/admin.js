const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const { ObjectId } = require('mongodb');

const uri = 'mongodb+srv://aiym:aiymaiym@cluster0.ug3bscp.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);
client.connect();

// DELET USER BY THIS ROUTE
router.post('/users/:id', async (req, res) => {
    try {
        const db = client.db('openWeather');
        const usersCollection = db.collection('users');
        await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// SHOW ADMIN PAGE
router.get('/admin', async (req, res) => {
    try {
        const db = client.db('openWeather');
        const usersCollection = db.collection('users');
        const users = await usersCollection.find({}).toArray();
        res.render('adminPage', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
