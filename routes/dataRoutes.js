const fetchData = require('../controllers/dataController');

module.exports = (app) => {

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

}