// const Lesson = require("../models/model").Lesson;

// exports.createLesson = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name) return res.status(400).json({ message: "Lesson name required" });

//     const lesson = await Lesson.create({ name });
//     res.status(201).json(lesson);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getLessons = async (req, res) => {
//   try {
//     const lessons = await Lesson.findAll();
//     res.json(lessons);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getLessonById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const lesson = await Lesson.findByPk(id);
//         if (!lesson) return res.status(404).json({ message: "Lesson not found" });
//         res.json(lesson);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }   
// };

// exports.updateLesson = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name } = req.body;
//         const lesson = await Lesson.findByPk(id);
//         if (!lesson) return res.status(404).json({ message: "Lesson not found" }); 
//         await lesson.update({ name });
//         res.json(lesson);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.deleteLesson = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const lesson = await Lesson.findByPk(id);
//         if (!lesson) return res.status(404).json({ message: "Lesson not found" });
//         await lesson.destroy();
//         res.json({ message: "Lesson deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };