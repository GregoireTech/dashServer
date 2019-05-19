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


const queryBuilder = (_userId, adminMode) => {
    let query = "SELECT user.user_name, md.comp_id, md.month, md.year, md.sales, md.sales_growth, md.sales_ytd,";
    query += " md.catering, md.catering_growth, md.catering_ytd, md.food_cost, md.food_cost_p,";
    query += " md.labor_cost, md.labor_cost_p, md.sampling, md.overring, md.bonus, md.bonus_dm, md.month_obj";
    query += " FROM month_data md";
    query += " JOIN user ON md.comp_id = user.user_company";
    query += " WHERE md.month_data_type = 1";
    if (!(adminMode && _userId === 1000)) {
        query += " AND user.user_id = " + _userId;
    } 
    query += " ORDER BY md.comp_id, md.year DESC, md.month DESC";

    return query;
}

const leadQueryBuilder = (_userId, adminMode) => {
    let query = "";

    if (adminMode && _userId === 1000) {
        query += "SELECT 'Leadership' AS user_name,";
        query += " md.month, md.year,";
        query += " SUM(md.sales) AS sales,";
        query += " ROUND(((sales - month_obj)/month_obj)*100  ,1) AS sales_growth,";
        query += " SUM(md.sales_ytd) AS sales_ytd,";
        query += " SUM(md.catering) AS catering," ;
        query += " AVG(md.catering_growth) AS catering_growth,";
        query += " SUM(md.catering_ytd) AS catering_ytd,";
        query += " SUM(md.food_cost) AS food_cost,";
        query += " ROUND((food_cost/sales)*100, 1) AS food_cost_p,";
        query += " SUM(md.labor_cost) AS labor_cost,";
        query += " ROUND((labor_cost/sales)*100, 1) AS labor_cost_p,";
        query += " SUM(md.sampling) AS sampling, SUM(md.overring) AS overring,";
        query += " SUM(md.bonus) AS bonus, SUM(md.bonus_dm) AS bonus_dm,";
        query += " SUM(md.month_obj) AS month_obj";
        query += " FROM month_data md";
        query += " WHERE md.month_data_type = 1";
        query += " AND md.comp_id IN (SELECT user.user_company FROM user WHERE user.user_name != 'Leadership')";
        query += " GROUP BY md.month, md.year";
        query += " ORDER BY md.year DESC , md.month DESC;";
    } 

    return query;
}

const resultFormatter = (userId, result, leadResult) => {
    const rawData = result[0];
    let data = {};
    
    for (monthData of rawData){
        const DataObj = new MonthDataObj(monthData);
        const month = DataObj.getMonth();
        if (userId === 1000) {
            if (!data[monthData.user_name]){
                data[monthData.user_name] = {};
            }
            data[monthData.user_name][month] = DataObj.createJSONObject();
        } else {
            data[month] = DataObj.createJSONObject();
            if (!data[monthData.user_name]){
                data[monthData.user_name] = {};
            }
            data[monthData.user_name][month] = DataObj.createJSONObject();
        }
    }

    if (userId === 1000 && leadResult[0]){
        const leadData = leadResult[0];
        for (monthData of leadData){
            const DataObj = new MonthDataObj(monthData);
            const month = DataObj.getMonth();
            if (!data['Leadership']){
                data['Leadership'] = {};
            }
            data['Leadership'][month] = DataObj.createJSONObject();
        }
    }
    return data;

}

const fetchData = (reqData) => {
    let userId,
    data,
    rawData;
    // Define the query
    return new Promise(resolve => {
        verifyToken(reqData.token)
            .then(_userId => {
                userId = _userId;
                const dataQuery = queryBuilder(userId, true);
                if (userId > 0) {
                    return queryRunner(dataQuery);
                } else {
                    resolve(false);
                }
            })
            .then(resData => {
                // Format the result
                if (userId === 1000){
                    rawData = resData;
                    const leadDataquery = leadQueryBuilder(userId, true);
                    return queryRunner(leadDataquery);
                } 
                data = resultFormatter(userId, resData);
                resolve(data);
            })
            .then(resLeadData => {
                data = resultFormatter(userId,rawData, resLeadData);
                resolve(data);
            })
            .catch(err => {
                console.log(err);
                resolve(false);
            });
    });
}



module.exports = fetchData;