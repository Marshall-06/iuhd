const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupController")
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");


router.post("/create", authMiddleware, adminOnly, controller.createGroup);
router.get("/all", authMiddleware, controller.getAllGroups);
router.get("/:id", authMiddleware, controller.getGroupById);
router.put("/update/:id", authMiddleware, adminOnly, controller.updateGroup);
router.delete("/delete/:id", authMiddleware, adminOnly, controller.deleteGroup);

module.exports = router;
