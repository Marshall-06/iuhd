const Question = require("../models/model").Question;

exports.createQuestion = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Question text required" });

    const question = await Question.create({ text });
    res.status(201).json({ message: "Question created", question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getQuestionsById = async (req, res) => {
    try{
        const { id } = req.params;
        const question = await Question.findByPk(id);
        if (!question) return res.status(404).json({ message: "Question not found" });
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findByPk(id);
        if (!question) return res.status(404).json({ message: "Question not found" });

        await question.destroy();
        res.json({ message: "Question deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const question = await Question.findByPk(id);
        if (!question) return res.status(404).json({ message: "Question not found" });

        await question.update({ text });
        res.json({ message: "Question updated successfully", question });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};