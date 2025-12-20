const LessonAssignment = require("../models/model").LessonAssignment;

exports.assignTeacher = async (req, res) => {
  try {
    const { lessonId, groupId, teacherId, type } = req.body;

    if (!lessonId || !groupId || !teacherId || !type)
      return res.status(400).json({ message: "All fields required" });

    const exists = await LessonAssignment.findOne({
      where: { lessonId, groupId, type }
    });

    if (exists)
      return res.status(409).json({ message: "Already assigned" });

    const assignment = await LessonAssignment.create({
      lessonId,
      groupId,
      teacherId,
      type
    });

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await LessonAssignment.findAll();   
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getAssignmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await LessonAssignment.findByPk(id);
        if (!assignment) return res.status(404).json({ message: "Assignment not found" });
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAssignmentsByGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const assignments = await LessonAssignment.findAll({ where: { groupId } });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const { lessonId, groupId, teacherId, type } = req.body;
        const assignment = await LessonAssignment.findByPk(id);
        if (!assignment) return res.status(404).json({ message: "Assignment not found" });
        await assignment.update({ lessonId, groupId, teacherId, type });
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const assignment = await LessonAssignment.findByPk(id);
        if (!assignment) return res.status(404).json({ message: "Assignment not found" });
        await assignment.destroy();
        res.json({ message: "Assignment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};