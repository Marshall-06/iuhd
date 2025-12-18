const router = require("express").Router();
const controller = require("../controllers/authController");


//registrasiya for student
// router.post("/student/register", controller.studentRegister);

//registrasiya
router.post("/register", controller.register);

// admin login
router.post("/admin/login", controller.adminLogin);

//talyp login
router.post("/student/login", controller.loginStudent)

module.exports = router;
