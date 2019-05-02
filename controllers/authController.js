const db = require('../util/database');
const {OAuth2Client} = require('google-auth-library');
const keys = require('../config/keys');



const queryRunner = (_query) => {
    console.log(_query);
    return new Promise(resolve => {
        db.execute(_query)
            .then(data => resolve(data))
            .catch(err => console.log(err));
    })
}

const loginHandler = (token) => {
   // console.log('in loginhandler, token : ' + token)
    return new Promise(resolve => {
        let authData = {
            status: false,
            message: 'Unvalid email address' 
        };
        getEmailFromToken(token)
        .then(email => {
            // Define the query
            let request = `select USER.USER_NAME from USER where USER.USER_EMAIL = '${email}'`;
            return queryRunner(request)
        })
        .then(result => {
            if (result[0].length > 0) {
                const userName = result[0][0].USER_NAME;
                console.log('result from email verif : ' + userName)
                resolve({
                    status: true,
                    userName: userName
                });
            } else {
                resolve(authData);
            }
        })
        .catch(e => {
            console.log(e);
            authData.message = 'Unable to process login, please try again';
            resolve(authData);
        });
    });
}



/**
 * Returns the email adress corresponding to the Google token 
 * @param {string} token 
 */
const getEmailFromToken = async (token) => {
    const client = new OAuth2Client(keys.googleClientID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: keys.googleClientID  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload.email;
}


//exports.verifyToken = verifyTokenHandler;
exports.authHandler = loginHandler;
exports.getEmailFromToken = getEmailFromToken;



/*

const getToken = (_userId) => {
    let query = `select TOKEN.TOKEN_STR from TOKEN where TOKEN.USER_ID = ${_userId}`;
    return new Promise(resolve => {
        let token;
        queryRunner(query)
            .then(data => {
                if (data[0].length > 0) {
                    token = data[0][0].TOKEN_STR;
                    resolve(token);
                } else {
                    token = generateToken();
                    query = 'insert into TOKEN ( USER_ID, TOKEN_STR)';
                    query += ` values ( ${_userId}, '${token}') ;\n`;
                    return queryRunner(query);
                }
            })
            .then(result => resolve(token))
            .catch(e => resolve(e));
    });
}

/**
 * This fn tries to retrieve the user id corresponding to a given token and returns it
 * @param {string} token 
 * @return {number} the user's id if it is found or an empty string
 
const verifyTokenHandler = (token) => {
    return new Promise(resolve => {
        let query = `select TOKEN.USER_ID from TOKEN where TOKEN.TOKEN_STR = '${token}'`;
        queryRunner(query)
            .then(data => {
                if (data[0].length > 0) {
                    const userId = data[0][0].USER_ID;
                    resolve(userId);
                } else {
                    resolve(-1);
                }
            })
            .catch(e => console.log(e));
    });
}


const generateToken = () => {
    const pin = JSON.stringify(Math.floor(Math.random() * Math.floor(10000)));
    let token = Date.now().toString(36); //Create the uids in chronological order
    token += pin;
    token += (Math.round(Math.random() * 36)).toString(36); //Add a random character at the end
    return token;
}



*/