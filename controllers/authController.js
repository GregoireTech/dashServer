const db = require('../util/database');

function displayResult (result){
    console.log(result);
}

const queryRunner = (_query, callback, arg) => {
    db.execute(_query)
        .then(data => {
            // Format the result
            if(arg){
                callback(data, arg);
            } else {
                callback(data);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

const generateToken = () => {
    const pin = JSON.stringify(Math.floor(Math.random() * Math.floor(10000)));
    let token = Date.now().toString(36); //Create the uids in chronological order
    token += pin;
    token += (Math.round(Math.random() * 36)).toString(36); //Add a random character at the end
    return token;
}

const getToken = (_userId, res) => {
    let query = `select TOKEN.TOKEN_STR from TOKEN where TOKEN.USER_ID = ${_userId}`;

    function handleResult(data, res) {
        let token;
        if (data[0].length > 0) {
            token = data[0][0].TOKEN_STR;
        } else {
            token = generateToken();
            query = 'insert into TOKEN ( USER_ID, TOKEN_STR)';
            query += ` values ( ${_userId}, '${token}') ;\n`;
            //query += ' COMMIT;'
            queryRunner(query, displayResult);
        }
        res.send({
            token: token
        });
    }
    queryRunner(query, handleResult, res);

}


const loginHandler = (req, res) => {
    let data = req.query;
    // Define the query
    //const monthYear = month + '_' + year;
    let query = `select USER.USER_ID from USER where USER.USER_NAME = '${data.username}'`;
    query += ` and USER.USER_PASS = '${data.password}'`;

    function handleResult(result) {
        if (result[0].length > 0) {
            const userId = result[0][0].USER_ID;
            userToken = getToken(userId, res);
        } else {
            res.send({
                token: false
            });
        }
    }
    // Run the query
    queryRunner(query, handleResult, false);
}

// Not Yet Working
const verifyTokenHandler = (token) => {
    console.log(token)
    let query = `select TOKEN.USER_ID from TOKEN where TOKEN.TOKEN_STR = '${token}'`;
    const isValid = queryRunner(query);
    return isValid;
}


exports.verifyToken = verifyTokenHandler;
exports.login = loginHandler;