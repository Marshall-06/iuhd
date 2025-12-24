// const LessonAssignment = require("../models/model").LessonAssignment;
const {LessonAssignment} = require("../models/model");

exports.assignTeacher = async (req, res) => {
  try {
    const { teacherId, groupId, types } = req.body; // types = ["lecture", "seminar"] etc.

    if (!teacherId || !groupId || !types || !Array.isArray(types) || !types.length) {
      return res.status(400).json({ message: "teacherId, groupId, and types are required" });
    }

    const created = [];

    for (const type of types) {
      const exists = await LessonAssignment.findOne({
        where: { teacherId, groupId, type }
      });

      if (!exists) {
        created.push({ teacherId, groupId, type });
      }
    }

    if (!created.length) {
      return res.status(400).json({
        message: "Teacher already assigned for the selected lesson types"
      });
    }

    await LessonAssignment.bulkCreate(created);

    res.status(201).json({
      message: "Teacher assigned successfully",
      assignments: created
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.assignTeacherToMultipleGroups = async (req, res) => {
  try {
    const { teacherId, groupIds, types } = req.body;

    if (!teacherId || !Array.isArray(groupIds) || !groupIds.length || !Array.isArray(types) || !types.length) {
      return res.status(400).json({ message: "teacherId, groupIds, and types are required" });
    }

    const assignments = [];

    for (const groupId of groupIds) {
      for (const type of types) {
        const exists = await LessonAssignment.findOne({ where: { teacherId, groupId, type } });
        if (!exists) {
          assignments.push({ teacherId, groupId, type });
        }
      }
    }

    if (!assignments.length) {
      return res.status(400).json({ message: "Teacher already assigned to all specified groups and types" });
    }

    await LessonAssignment.bulkCreate(assignments);

    res.status(201).json({ message: "Teacher assigned to multiple groups successfully", assignments });

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

exports.getAssignmentByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const assignments = await LessonAssignment.findAll({ where: { teacherId } });
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