const express = require("express");
const router = express.Router();
const menu = require("../controllers/menu")
const history = require("../controllers/history")
const interactions = require("../controllers/interactions");

router.get("/announcements", interactions.announcementPage);
router.get("/feedback", interactions.viewFeedback);
router.post("/post-announcement", interactions.postAnnouncement)
router.post("/edit-announcement", interactions.editAnnoucement);

router.get("/history", history.getPastStats);
router.get("/generate-sheet", history.generateAdminExcel);

router.get("/week", menu.getWeekMenu);
router.get("/change-menu", menu.changeMenuPage);
router.post("/post-menu-changes", menu.postMenuChanges);
router.get("/", menu.getFootFall);

module.exports = router;
