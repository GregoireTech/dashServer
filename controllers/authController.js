const db = require('../util/database');

const queryRunner = (_query) => {
    console.log(_query);
    return new Promise(resolve => {
        db.execute(_query)
            .then(data => resolve(data))
            .catch(err => console.log(err));
    })
}

const generateToken = () => {
    const pin = JSON.stringify(Math.floor(Math.random() * Math.floor(10000)));
    let token = Date.now().toString(36); //Create the uids in chronological order
    token += pin;
    token += (Math.round(Math.random() * 36)).toString(36); //Add a random character at the end
    return token;
}

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


const loginHandler = (req) => {
    return new Promise(resolve => {
        let data = req.query;
        // Define the query
        let request = `select USER.USER_ID from USER where USER.USER_NAME = '${data.user}'`;
        request += ` and USER.USER_PASS = '${data.pass}'`;
        queryRunner(request)
            .then(result => {
                if (result[0].length > 0) {
                    const userId = result[0][0].USER_ID;
                    return getToken(userId);
                } else {
                    resolve('');
                }
            })
            .then(token => resolve(token))
            .catch(e => console.log(e));
    });
}

/**
 * This fn tries to retrieve the user id corresponding to a given token and returns it
 * @param {string} token 
 * @return {number} the user's id if it is found or an empty string
 */
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


exports.verifyToken = verifyTokenHandler;
exports.login = loginHandler;