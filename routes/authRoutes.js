const authHandler = require('../controllers/authController').authHandler;

module.exports = (app) => {
    
    app.post('/auth/google', (req, res) => {
        // Define auth as declined by default
        let authData = {
            status: false,
            message: 'Unvalid token' 
        };
        let token = false;
        //console.log(req.body)
        try {
            const tokenType = typeof(req.body.tokenObj.id_token);
            if (tokenType === 'string'){
                token = req.body.tokenObj.id_token;
            }
        } catch (e){
            console.log('impossible to retrieve token from FE request body');
            res.send({authData});
        }
        // If we successfully retrieve a token to verify
        if(token){
            authHandler(token)
            .then(authResult => {
                console.log(authResult);
                res.send({authResult});
            })
        } else {
            res.send({authData});
        }
    });
    
}











/* OLD CODE TO USE FOR MODULES









if(token){
            //console.log(token)
            verify(token)
            .then(payload => {
                return verifyEmail(payload.email);
            })
            // Only update auth package if we get a response on email check
            .then(authResult => {
                authData = {...authResult}
                console.log(authData)
                res.send({authData});
            })
            .catch((e) => {
                console.error;
                res.send({authData});
            });
        } else {
            res.send({authData});
        }















 // Route for Google auth
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

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

    app.get('/api/logout', (req, res) => {
        console.log('logout')
        res.send(req.user);
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });








*/