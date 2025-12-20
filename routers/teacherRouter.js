const express = require("express")
const router = express();
const teacherController = require("../controllers/teacherController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

router.get("/group/:groupId", authMiddleware, teacherController.getTeachersByGroup);
router.post("/rate", authMiddleware, teacherController.rateTeacher);
router.get("/summary/:teacherId", authMiddleware, adminOnly, teacherController.getTeacherRatingSummary);


module.exports = router;