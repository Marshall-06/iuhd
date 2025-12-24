const express = require("express");
const router = express.Router();
const controller = require("../controllers/excelController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

router.get("/", controller.exportTeacherRatingsToExcel);

module.exports = router;
