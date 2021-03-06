const express = require('express');
const PORT = process.env.PORT || 8888;

const fetchData = require('./controllers/dataController');
const handleLogin = require('./controllers/authController').login;
const verifyToken = require('./controllers/authController').verifyToken;

const app = express();

// Allow for cross origins
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


// Set the main route
app.get('/data', (req, res) => {
    const reqData = req.query;
    try {
        fetchData(reqData)
            .then(data => {
                if (data) {
                    res.send({
                        status: true,
                        data: data
                    });
                } else {
                    res.send({
                        status: false,
                        data: null
                    });
                }
            })
            .catch(e => {
                console.error(e);
                res.send({
                    error: e
                });
            });

    } catch (e) {
        console.error(e);
        res.send({
            error: e
        });
    }
});

app.get('/login', (req, res) => {
    const reqData = req.query;
    console.log('req data: ' + reqData)
    try {
        if (reqData.token) {
            console.log('verify token')
            verifyToken(reqData.token)
                .then(userId => {
                    if (userId > 0) {
                        res.send({
                            authStatus: true,
                            token: reqData.token
                        });
                    } else {
                        res.send({
                            authStatus: false,
                            token: reqData.token
                        });
                    }
                })
                .catch(e => console.log(e));
        } else if (reqData.user && reqData.pass) {
            console.log('handle login');
            handleLogin(req)
                .then(token => {
                    console.log('got token : ' + token);
                    if (token !== '') {
                        res.send({
                            authStatus: true,
                            token: token
                        });
                    } else {
                        res.send({
                            authStatus: false,
                            token: token
                        });
                    }
                })
        } else {
            console.log('Impossible to handle login, data incomplete. ');
            res.send({
                authStatus: false,
                token: ''
            });
        }
    } catch (e) {
        console.error(e);
        res.send({
            token: false
        });
    }
});


app.listen(PORT, () => {
    console.log('listening at : ' + PORT);
});