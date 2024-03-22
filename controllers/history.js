const Order = require("../models/order");
const Stat = require("../models/daily-stat");
const fs = require("fs");
const utils = require("../utils/common-functions");

exports.getPaymentHistory = (req, res) => {
    Order
        .find({ studentId: req.session.user.userId })
        .then(orders => {
            var total = 0;
            for (const order of orders) 
                total += order.total;
            res.render("common/history.pug", {
                userType: req.session.user.userType,
                records: orders,
                total: total,
                error: utils.handleFlash(req),
                pageTitle: "Payment History",
                username: req.session.user.alias
            });
        })
}

exports.getPastStats = (req, res) => {
    Stat.find()
        .then(stats => {
            var total = 0;
            for (const dailystat of stats) 
                total += dailystat.total;
            res.render("common/history.pug", {
                userType: req.session.user.userType,
                records: stats,
                total: total,
                pageTitle: "Order Statistics",
                username: req.session.user.alias
            });
        })
}

const mealTimeOrder = (itemsOrdered) => {
    const itemCSV = [];
    for (const item of itemsOrdered) {
        itemCSV.push([
            item.name,
            item.price,
            item.qty,
            item.price * item.qty
        ])
    }
    return itemCSV;
}

exports.generateStudentExcel = (req, res) => {
    Order
        .find({ studentId: req.session.user.userId })
        .then(orders => {
            if (!orders) 
                throw new Error("No order to generate a file of!");
            return orders;
        })
        .then(orders => {
            const filename = `${req.session.user.alias}-${orders[0].date.replace(/\//g, "-")}to${orders[orders.length-1].date.replace(/\//g, "-")}-data.csv`;
            const csv = [["Date", "Meal Time", "Item Name", "Item Price", "Item Quantity", "Item Amount"]];
            for (const order of orders) {
                const breakfastCSV = mealTimeOrder(order.breakfast);
                for (const mealItemDetails of breakfastCSV) 
                    csv.push([order.date, "Breakfast", ...mealItemDetails]);

                const lunchCSV = mealTimeOrder(order.lunch);
                for (const mealItemDetails of lunchCSV) 
                    csv.push([order.date, "Lunch", ...mealItemDetails]);

                const dinnerCSV = mealTimeOrder(order.dinner); 
                for (const mealItemDetails of dinnerCSV) 
                    csv.push([order.date, "Dinner", ...mealItemDetails]);               
            }
            return [csv, filename];
        })
        .then(csvData => {
            const csvContent = csvData[0].map(row => row.join(",")).join("\n");
            fs.writeFile(csvData[1], csvContent, err => {
                if (err) throw err;
                res.download(csvData[1], csvData[1], err => {
                    if (err) throw new Error(`${err}`);
                    fs.unlink(csvData[1], (err) => {
                        if (err) throw new Error(`${err}`);
                        console.log('CSV file deleted.');
                    });
                })
            });
        })
        .catch(err => {
            req.flash("error", `While generating excel file: ${err}`);
            res.redirect("/history")
        })
};

exports.generateAdminExcel = (req, res) => {
    Stat.find()
        .then(stats => {
            const filename = `${req.session.user.alias}-${stats[0].date.replace(/\//g, "-")}to${stats[stats.length-1].date.replace(/\//g, "-")}-stat.csv`;
            if (!stats) throw new Error("No stat to generate!");
            const csv = [["Date", "Meal Time", "Footfall", "Money Collected"]];
            for (const dailystat of stats) {
                csv.push([
                    dailystat.date, 
                    "Breakfast", 
                    dailystat.breakfast.footfall,
                    dailystat.breakfast.money
                ]);
                csv.push([
                    dailystat.date,
                    "Lunch",
                    dailystat.lunch.footfall,
                    dailystat.lunch.money
                ]);
                csv.push([
                    dailystat.date,
                    "Dinner",
                    dailystat.dinner.footfall,
                    dailystat.dinner.money
                ])
            }
            return [csv, filename];
        })
        .then(csvData => {
            const csvContent = csvData[0].map(row => row.join(",")).join("\n");
            console.log(csvContent);
            fs.writeFile(csvData[1], csvContent, err => {
                if (err) throw err;
                res.download(csvData[1], csvData[1], err => {
                    if (err) throw new Error(`${err}`);
                    fs.unlink(csvData[1], (err) => {
                        if (err) throw new Error(`${err}`);
                        console.log('CSV file deleted.');
                    });
                })
            });
        })
        .catch(err => {
            req.flash("error", err);
            res.redirect("/admin/history");
        })
};