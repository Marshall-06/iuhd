const express = require("express")
const router = express();
const questionController = require("../controllers/questionController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, adminOnly, questionController.createQuestion);
router.get("/all", authMiddleware, questionController.getAllQuestions);
router.get("/:id", authMiddleware, questionController.getQuestionsById);
router.put("/update/:id", authMiddleware, adminOnly, questionController.updateQuestion);
router.delete("/delete/:id", authMiddleware, adminOnly, questionController.deleteQuestion);

module.exports = router;