const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupController")
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");


router.post("/create",  controller.createGroup);
router.get("/all", controller.getAllGroups);
router.get("/:id",   controller.getGroupById);
router.put("/update/:id",  controller.updateGroup);
router.delete("/delete/:id",  controller.deleteGroup);

module.exports = router;
