const express = require('express');

const getData = require('./controllers/queryBuilder');
const handleLogin = require('./controllers/authController').login;

const app = express();

// Allow for cross origins
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});




// Set the main route
app.post('/data', (req, res) => {
    console.log(req.query);
    try {
        getData(req, res);
    } catch (e) {
        console.error(e);
    }
    console.log('login');
});

app.post('/login', (req, res) => {
    console.log(req.query);
    try {
        handleLogin(req, res);
    } catch (e) {
        console.error(e);
    }
    console.log('login');
});

app.post('/', (req, res) => {
    getData(req, res);
});

app.listen(8888, () => {
    console.log('listening at : http://localhost:8888');
});