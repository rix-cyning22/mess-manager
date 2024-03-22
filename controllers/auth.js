const User = require("../models/user");
const bcrypt = require("bcryptjs");
const utils = require("../utils/common-functions");

exports.getLoginPage = (req, res) => {
    const error = utils.handleFlash(req);
    res.render("auth/login.pug", {
        error: error,
        pageTitile: "Log In"
    });
};

exports.handleLogin = (req, res) => {
    if (!req.body.userId || !req.body.password) {
        req.flash("error", "Fill all the fields first!");
        return res.redirect("/auth/login");
    }
    User.findOne({ userId: req.body.userId })
        .then(user => {
            if (!user)  throw new Error("Invalid user ID or password");
            bcrypt
                .compare(req.body.password, user.password)
                .then(match => {
                    if (!match) throw new Error("Invalid user ID or password");
                    req.session.user = user;
                })
                .then(() => {
                    if (req.session.user.userType == "admin")
                        res.redirect("/admin");
                    else if (req.session.user.userType == "student")
                        res.redirect("/");
                })
        })
        .catch(err => {
            req.flash("error", `${err}`);
            return res.redirect("/auth/login");
        });
}

exports.getSignupPage = (req, res) => {
    error = utils.handleFlash(req);
    res.render("auth/signup.pug", { 
        error: error,
        pageTitile: "Sign Up"
    });
};

exports.handleSignup = (req, res) => {
    if (!req.body.userId || !req.body.password) {
        req.flash("error", "Fill all the fields first!");
        return res.redirect("/auth/login");
    }
    User
        .findOne({ userId: req.body.userId })
        .then(user => {
            if (user) throw new Error("User already exists!");
            if (req.body.toggle != "student" && req.body.toggle != "admin") 
                throw new Error("Not a valid user type");
            if (req.body.password != req.body.confirmPassword) 
                throw new Error("Passwords don't match!");
            return bcrypt
                .hash(req.body.password, 12)
                .then(hashedPassword => {
                    const userData = {
                        alias: req.body.alias,
                        userId: req.body.userId,
                        password: hashedPassword,
                        userType: req.body.toggle,
                    }
                    if (req.body.toggle == "student")
                        userData.lastOrdered ="";
                    req.session.user = userData;
                    const user = new User(userData);
                    user.save()
                        .then(() => {
                            if (userData.userType == "student")
                                res.redirect("/");
                            else
                                res.redirect("/admin");
                        })
                        .catch(err => console.log("error while saving: ", err));
                });
        })
        .catch(err => {
            req.flash("error", err);
            return res.redirect("/auth/signup");
        });
}

exports.handleLogout = (req, res) => {
    req.session.destroy();
    res.redirect("/auth/login");
}

exports.getAccountSettings = (req, res) => {
    const error = utils.handleFlash(req);
    res.render("auth/account-settings.pug", { 
        error: error,
        userType: req.session.user.userType,
        pageTitile: "Change Account Setings"
    })
}

exports.handleAccountSettings =(req, res) => {
    if (!req.body.changeName && !req.body.changePassword) {
        req.flash("error", "Change something before clicking the button!");
        return res.redirect("/auth/account-settings");
    }
    if (!req.body.oldAlias || !req.body.oldPassword) {
        req.flash("error", "User could not be verified!");
        return res.redirect("auth/account-settings");
    }
    User.findOne({ userId: req.session.user.userId })
        .then(user => {
            if (!user) throw new Error("user not found!");
            if (user.alias != req.body.oldAlias) 
                throw new Error("invalid username or password");
            bcrypt
                .compare(user.password, req.body.oldPassword)
                .then(match => {
                    if (!match) throw new Error("invalid username or password");
                    if (req.body.newPassword != req.body.confirmPassword) 
                        throw new Error("new passwords should match!");
                    if (req.body.changeName && req.body.changeName=="ok") {
                        if (user.alias === req.body.newAlias) 
                            throw new Error("cannot use the same user name");
                        user.alias = req.body.newAlias;
                    }
                    if (req.body.changePassword && req.body.changePassword=="ok") 
                        bcrypt
                            .compare(user.password, req.body.newPassword)
                            .then(match => {
                                if (match) throw new Error("cannot use the same password");
                                bcrypt
                                    .hash(req.body.newPassword, 12)
                                    .then(hashed => {
                                        user.password = hashed;
                                        user.save()
                                            .then(savedUser => {
                                                console.log(savedUser);
                                                return res.redirect("/auth/logout");
                                            })
                                    })
                            })
                })
        })
        .catch(err => {
            req.flash("error", `${err}`);
            res.redirect("/auth/account-settings");
        })
}