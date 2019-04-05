const db = require('../util/database');
const verifyToken = require('./authController').verifyToken;
const MonthDataObj = require('../models/MonthData');



const queryRunner = (_query) => {
    console.log(_query);
    return new Promise(resolve => {
        db.execute(_query)
            .then(data => resolve(data))
            .catch(err => console.log(err));
    })
}


const queryBuilder = (_userId) => {
    let query = "SELECT user.user_name, md.comp_id, md.month, md.year, md.sales, md.sales_growth, md.sales_ytd,";
    query += " md.catering, md.catering_growth, md.catering_ytd, md.food_cost, md.food_cost_p,";
    query += " md.labor_cost, md.labor_cost_p, md.sampling, md.overring, md.bonus, md.bonus_dm";
    query += " FROM month_data md";
    query += " JOIN user ON md.comp_id = user.user_company";
    query += " WHERE md.month_data_type = 1";
    if (_userId !== null) query += " AND user.user_id = " + _userId;
    query += " ORDER BY md.comp_id, md.year DESC, md.month DESC";

    return query;
}

const resultFormatter = (userId, result) => {
    const rawData = result[0];
    let data = {};
    if (userId === 1000) {

    } else {
        for (monthData of rawData){
            const DataObj = new MonthDataObj(monthData);
            const month = DataObj.getMonth();
            data[month] = DataObj.createJSONObject();
        }
    }
    return data;

}

const fetchData = (reqData) => {
    let userId;
    // Define the query
    return new Promise(resolve => {
        verifyToken(reqData.token)
            .then(_userId => {
                userId = _userId;
                const dataQuery = queryBuilder(userId);
                if (userId > 0) {
                    return queryRunner(dataQuery);
                } else {
                    resolve(false);
                }
            })
            .then(resData => {
                // Format the result
                const result = resultFormatter(userId, resData);
                resolve(result);
            })
            .catch(err => {
                console.log(err);
                resolve(false);
            });
    });
}



module.exports = fetchData;