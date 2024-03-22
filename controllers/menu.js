const Menu = require("../models/menu");
const Order = require("../models/order");
const Stat = require("../models/daily-stat");
const User = require("../models/user");
const utils = require("../utils/common-functions");

exports.getMenu = (req, res) => {
    if (req.session.user.userType == "admin")
        return res.redirect("/admin");

    const [todayDate, dow] = utils.getDayDow();
    error = utils.handleFlash(req);
    var lastOrdered = req.session.user.lastOrdered;
    if (req.session.menu && req.session.menu.date)
        lastOrdered = todayDate;
    Menu.findOne({ day: dow})
        .then(todayMenu => {
            res.render("student/menu.pug", {
                menu: todayMenu,
                userType: "student",
                dayOfWeek: dow,
                date: todayDate,
                lastOrdered: lastOrdered,
                error: error,
                pageTitle: "Menu",
                username: req.session.user.alias
            })
        })
        .then(() => req.session.menu = {})
        .catch(err => console.log(err));
}

exports.postOrder = (req, res) => {
    if ((req.body.breakfast.length == 0 && req.body.lunch.length == 0 && req.body.dinner == 0) || !req.body.date) {
        req.flash("error", "Select Something to order first!");
        return res.status(404).json({});
    }
    req.session.menu = req.body;
    return res.status(200).json({});
}

exports.getConfirmPage = (req, res) => {
    res.render("student/confirm-order.pug", {
        userType: "student",
        menu: req.session.menu,
        pageTitle: "Confirm Order",
        username: req.session.user.alias
    })
}

exports.postConfirmation = (req, res) => {
    if (req.body.buttonType == "confirm-order") {
        breakfastAmt = utils.mealPrice(req.session.menu.breakfast);
        lunchAmt = utils.mealPrice(req.session.menu.lunch);
        dinnerAmt = utils.mealPrice(req.session.menu.dinner);
        const orderData = {
            ...req.session.menu,
            studentId: req.session.user.userId,
            total: breakfastAmt + lunchAmt + dinnerAmt
        };
        const order = new Order(orderData);
        order
            .save()
            .then(() => {
                Stat
                    .findOne({ date: req.session.menu.date })
                    .then(statData => {
                        if (!statData) {
                            const stat = Stat({
                                date: req.session.menu.date,
                                breakfast: {footfall: 1, money: breakfastAmt},
                                lunch: {footfall: 1, money: lunchAmt},
                                dinner: {footfall: 1, money: dinnerAmt},
                                total: breakfastAmt + lunchAmt + dinnerAmt
                            });
                            stat.save()
                        }
                        else {
                            statData.breakfast.footfall++;
                            statData.lunch.footfall++;
                            statData.dinner.footfall++;

                            statData.breakfast.money += breakfastAmt;
                            statData.lunch.money += lunchAmt;
                            statData.dinner.money += dinnerAmt;
                            statData.total += breakfastAmt + lunchAmt + dinnerAmt;

                            statData.save()
                        }
                    })
                    .then(() => {
                        req.session.menu = {};
                        req.session.ordered = true;
                    })
                    .catch(err => console.log(err));
            })
            .then(() => {
                const [day, dow] = utils.getDayDow();
                User.findOne({ userId: req.session.user.userId })
                    .then(userData => {
                        userData.lastOrdered = day;
                        userData
                            .save()
                            .then(savedUser => {
                                req.session.user = savedUser;
                            });
                    })
            })
    }
    else if (req.body.buttonType == "go-back")
        console.log("went back");
    return res.status(200).json({});
}

exports.getFootFall = (req, res) => {
    const [date, dow] = utils.getDayDow();
    Stat.findOne({ date: date})
        .then(dailyStat => {
            if (!dailyStat)
                dailyStat = {
                    date: date,
                    userType: "admin",
                    breakfast: { footfall: 0, money: 0 },
                    lunch: { footfall: 0, money: 0 },
                    dinner: { footfall: 0, money: 0 },
                    total: 0,
                    pageTitle: "Footfall",
                    username: req.session.user.alias
                }
           return res.render("admin/footfall.pug", {
                userType: "admin",
                footfalls: dailyStat,
                pageTitle: "FootFall",
                username: req.session.user.alias
            }); 
        })
        .catch(err => console.log(err));
}

exports.getWeekMenu = (req, res) => {
    Menu.find()
        .then(menu => {
            res.render("common/week.pug", {
                userType: req.session.user.userType,
                week: menu,
                pageTitle: "This Week's Menu",
                username: req.session.user.alias
            });
        })
        .catch(err => console.log(err));
}

exports.changeMenuPage = (req, res) => {
    Menu
        .find()
        .then(menuData => {
            res.render("admin/change-week-menu.pug", { 
                userType: "admin", 
                menu: menuData,
                pageTitle: "Change Menu",
                username: req.session.user.alias
            });
        })
        .catch(err => console.log(err));
}

exports.postMenuChanges = (req, res) => {
    if (req.body.breakfast == [] || req.body.lunch == [] || req.body.dinner == [])
      return;
    Menu.findOne({ day: req.body.day })
        .then(menu => {
            if (!menu) {
                const newMenu = new Menu({
                    day: req.body.day,
                    breakfast: req.body.breakfast,
                    lunch: req.body.lunch,
                    dinner: req.body.dinner
                })
                return newMenu;
            }
            change = false;
            if (menu.breakfast != req.body.breakfast) {
                menu.breakfast = req.body.breakfast;
                change = true;
            }
            if (menu.lunch != req.body.lunch) {
                change = true;
                menu.lunch = req.body.lunch;
            }
            if (menu.dinner != req.body.dinner) {
                change = true;
                menu.dinner = req.body.dinner;
            }
            if (change)
                return menu;
            else
                return;
        })
        .then(menu => {
            if (!menu)
                return;
            menu.save()
                .then(saved => {
                    return res.status(200).json({ day: saved.day });
                })
                .catch(err => {
                    console.log("Error Saving: ", err);
                    return res.status(500).json({ err: "internal server error "});
                });
        })
        .catch(err => console.log("Error Retrieving: ", err));
}