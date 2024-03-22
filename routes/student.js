const express = require("express");
const router = express.Router();
const menu = require("../controllers/menu");
const history = require("../controllers/history");
const interactions = require("../controllers/interactions")

router.get("/history", history.getPaymentHistory);
router.get("/generate-sheet", history.generateStudentExcel);

router.get("/announcements", interactions.announcementPage);
router.get("/view-feedback", interactions.viewFeedback)
router.get("/write-feedback", interactions.writeFeedback);
router.post("/post-feedback", interactions.postFeedback);

router.get("/week", menu.getWeekMenu);
router.get("/", menu.getMenu);
router.post("/process-order", menu.postOrder);
router.get("/confirm-order", menu.getConfirmPage);
router.post("/post-confirmation", menu.postConfirmation)

module.exports = router;