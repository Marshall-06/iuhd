const express = require("express")
const router = express();
const teacherController = require("../controllers/teacherController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

router.get("/group/:groupId",  teacherController.getTeachersByGroup);
router.post("/rate", teacherController.rateTeacher);
router.get("/summary/:teacherId",  teacherController.getTeacherRatingSummary);



router.get("/all", teacherController.getAllTeachers);


module.exports = router;