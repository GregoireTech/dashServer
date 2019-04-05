
class MonthData {
    constructor(rawData){
        this.rawData = rawData;
        this.monthMappingTable = {
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
    }
    createMonthString(month, year){
        return `${this.monthMappingTable[month]} ${year}`;
    }


    createJSONObject(){
        const JSONObj = {
            "Month": this.createMonthString(this.rawData.month, this.rawData.year),
            "Sales": this.rawData.sales || "No Data",
            "Growth": this.rawData.sales_growth/100 || "No Data",
            "SalesYTD": this.rawData.sales_ytd || "No Data",
            "Catering": this.rawData.catering || "No Data",
            "CateringP": this.rawData.catering_growth/100 || "No Data",
            "CateringYTD": this.rawData.catering_ytd || "No Data",
            "FoodCost": this.rawData.food_cost || "No Data",
            "FoodCostP": this.rawData.food_cost_p/100 || "No Data",
            "LaborCost": this.rawData.labor_cost || "No Data",
            "LaborCostP": this.rawData.labor_cost_p/100 || "No Data",
            "Sampling": this.rawData.sampling || "No Data",
            "Bonus": this.rawData.bonus || "No Data",
            "BonusDM": this.rawData.bonus_dm || "No Data",
            "Company": this.rawData.user_name
        }
        return JSONObj;
    }
}

module.exports = MonthData;