const db = require('../util/database');
const verifyToken = require('./authController').verifyToken;


const queryRunner = (_query) => {
    console.log(_query);
    return new Promise(resolve => {
        db.execute(_query)
            .then(data => resolve(data))
            .catch(err => console.log(err));
    })
}


const queryBuilder = (_userId) => {
    let query = "SELECT comp_id, month, year, sales, sales_growth, sales_ytd,";
    query += " catering, catering_growth, catering_ytd, food_cost, food_cost_p,";
    query += " labor_cost, labor_cost_p, sampling, overring, bonus, bonus_dm";
    query += " FROM month_data";
    query += " JOIN user ON month_data.comp_id = user.user_company";
    query += " WHERE month_data_type = 1";
    if (_userId !== null) query += " AND user.user_id = " + _userId;
    query += " ORDER BY comp_id, year DESC, month DESC";

    return query;
}

const resultFormatter = _response => {
    // Extract the data element from response
    const result = _response[0];
    const data = {};
    // Every 
    for (row of result) {
        if (!data[row['comp_name']]) data[row['comp_name']] = []
        data[row['comp_name']].push(row);
    }
    return data;
}

const fetchData = (reqData) => {
    //let data;
    // Define the query
    return new Promise(resolve => {
        verifyToken(reqData.token)
            .then(userId => {
                const dataQuery = queryBuilder(userId);
                if (userId > 0) {
                    return queryRunner(dataQuery);
                } else {
                    resolve(false);
                }
            })
            .then(data => {
                // Format the result
                //const result = resultFormatter(data);
                resolve(data[0]);
            })
            .catch(err => {
                console.log(err);
                resolve(false);
            });
    });
}



module.exports = fetchData;