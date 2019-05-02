const fetchData = require('../controllers/dataController').fetchData;
const getEmailFromToken = require('../controllers/authController').getEmailFromToken;

module.exports = (app) => {
    let resData = {
        status: false,
        message: 'Unvalid token' 
    };
    app.post('/api/data', (req, res) => {
        // Define auth as declined by default
        try {
            //console.log(req.body)
            const tokenType = typeof(req.body.tokenObj.id_token);
            console.log(tokenType)
            if (tokenType === 'string'){
                token = req.body.tokenObj.id_token;
            } else {
                res.send({resData});
                return;
            }
        } catch (e){
            console.log('impossible to retrieve token from FE request body');
            res.send({resData});
            return;
        }
        if (token){
            getEmailFromToken(token)
            .then(email => {
                console.log('got email : ' + email)
                return fetchData(email)
            })
            .then(resultData => {
                console.log('got the data to send: ' + resultData)
                res.send({resultData});
            })
            .catch(e => {
                console.log(e);
                res.send({resData});
            })
        }
    })
}





