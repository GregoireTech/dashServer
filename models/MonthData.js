const MonthMappingTable = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
}

class MonthData {
    constructor(rawData) {
        this.rawData = rawData;
        this.month = this.createMonthString(rawData.month, rawData.year)

    }
    createMonthString(month, year) {
        return `${MonthMappingTable[month]} ${year}`;
    }


    createJSONObject() {
        const JSONObj = {
            "Month": this.month,
            "Sales": this.rawData.sales,
            "Growth": this.rawData.sales_growth / 100,
            "SalesYTD": this.rawData.sales_ytd,
            "Catering": this.rawData.catering,
            "CateringP": this.rawData.catering_growth / 100,
            "CateringYTD": this.rawData.catering_ytd,
            "FoodCost": this.rawData.food_cost,
            "FoodCostP": this.rawData.food_cost_p / 100,
            "LaborCost": this.rawData.labor_cost,
            "LaborCostP": this.rawData.labor_cost_p / 100,
            "Sampling": this.rawData.sampling,
            "Bonus": this.rawData.bonus,
            "BonusDM": this.rawData.bonus_dm,
            "Objective": this.rawData.month_obj,
            "Company": this.rawData.user_name
        }
        return JSONObj;
    }

    getMonth() {
        return this.month;
    }
}

module.exports = MonthData;