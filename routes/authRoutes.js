

const passport = require('passport');

const handleLogin = require('../controllers/authController').login;
const verifyToken = require('../controllers/authController').verifyToken;



module.exports = (app) => {
    // Route for Google auth
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
    // Google login callback
    app.get('/auth/google/callback', passport.authenticate('google'));

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
    
}
