const express = require("express");
const router = express.Router();
const controller = require("../controllers/facultyController")
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");


router.post("/create", authMiddleware, adminOnly, controller.createFaculty);
router.get("/all", authMiddleware, controller.getAllFaculties);
router.get("/:id", authMiddleware, controller.getFacultyById);
router.put("/update/:id", authMiddleware, adminOnly, controller.updateFaculty);
router.delete("/delete/:id", authMiddleware, adminOnly, controller.deleteFaculty);

module.exports = router;
