const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

const loggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        if (req.session.user.userType == "student")
            return res.redirect("/");
        return res.redirect("/admin");
    }
    next();
}

router.get("/login", loggedIn, authController.getLoginPage);
router.post("/handle-login", loggedIn, authController.handleLogin);

router.get("/signup", loggedIn, authController.getSignupPage);
router.post("/handle-signup", loggedIn, authController.handleSignup);

router.get("/account-settings", authController.getAccountSettings);
router.post("/handle-account-settings", authController.handleAccountSettings);

router.get("/logout", authController.handleLogout);

module.exports = router