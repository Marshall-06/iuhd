const { LessonAssignment, User, TeacherRating, RatingAnswer } = require("../models/model");
const sequelize = require("../config/db");


// exports.getTeachersByGroup = async (req, res) => {

//   try {
//     const { groupId } = req.params;

//     // Find all lesson assignments for that group
//     const assignments = await LessonAssignment.findAll({
//       where: { groupId },
//       include: [
//         {
//           model: User,
//           as: "teacher", // must match your association alias
//           attributes: ["id", "Name", "Surname"]
//         }
//       ]
//     });

//     if (!assignments.length) return res.json([]);

//     // Aggregate teachers with lesson types
//     const teachersMap = {};
//     assignments.forEach(a => {
//       const t = a.teacher;
//       if (!teachersMap[t.id]) {
//         teachersMap[t.id] = {
//           teacherId: t.id,
//           name: t.Name,
//           surname: t.Surname,
//           lessonTypes: []
//         };
//       }
//       teachersMap[t.id].lessonTypes.push(a.type);
//     });

//     const teachers = Object.values(teachersMap);
//     res.json(teachers);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

exports.getTeachersByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const assignments = await LessonAssignment.findAll({
      where: { groupId },
      include: [{
        model: User,
        as: "teacher",
        attributes: ["id", "Name", "Surname"]
      }]
    });

    if (!assignments.length) {
      return res.json([]);
    }

    const teachersMap = {};

    for (const a of assignments) {
      if (!a.teacher) continue;

      const t = a.teacher;

      if (!teachersMap[t.id]) {
        teachersMap[t.id] = {
          teacherId: t.id,
          name: t.Name,
          surname: t.Surname,
          lessonTypes: new Set()
        };
      }

      teachersMap[t.id].lessonTypes.add(a.type);
    }

    // Convert Set → Array
    const result = Object.values(teachersMap).map(t => ({
      ...t,
      lessonTypes: Array.from(t.lessonTypes)
    }));

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.rateTeacher = async (req, res) => {
  try {
    const { teacherId, groupId, type, answers } = req.body;

    // 1️⃣ Validation
    if (!teacherId || !groupId || !type) {
      return res.status(400).json({
        message: "Group, teacher and lesson type are required"
      });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        message: "Answers are required"
      });
    }

    for (const a of answers) {
      if (!a.value || a.value < 1 || a.value > 5) {
        return res.status(400).json({
          message: "Each answer must be between 1 and 5"
        });
      }
    }

    // 2️⃣ Check assignment
    const assignment = await LessonAssignment.findOne({
      where: { teacherId, groupId, type }
    });

    if (!assignment) {
      return res.status(403).json({
        message: "Teacher is not assigned to this group for this lesson type"
      });
    }

    // 3️⃣ Calculate average score ✅
    const avgScore =
      answers.reduce((sum, a) => sum + Number(a.value), 0) / answers.length;

    // 4️⃣ Save rating summary ✅
    await TeacherRating.create({
      teacherId,
      groupId,
      type,
      avgScore: Number(avgScore.toFixed(2))
    });

    res.status(201).json({
      message: "Rating submitted successfully",
      avgScore: avgScore.toFixed(2)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



exports.getTeacherRatingSummary = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = await User.findOne({
      where: { id: teacherId, role: "teacher" },
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const ratedNumbers = await TeacherRating.count({
      where: { teacherId }
    });

    const overallRaw = await TeacherRating.findOne({
  where: { teacherId },
  attributes: [[sequelize.fn("AVG", sequelize.col("avg_score")), "overallAverage"]],
  raw: true
});

    const lessonTypesRaw = await TeacherRating.findAll({
  where: { teacherId },
  attributes: [
    "type",
    [sequelize.fn("AVG", sequelize.col("avg_score")), "averageScore"]
  ],
  group: ["type"],
  raw: true
});

    const lessonTypes = lessonTypesRaw.map(item => ({
  type: item.type,
  averageScore: parseFloat(item.averageScore || 0).toFixed(2)
}));

const overallAverage = parseFloat(overallRaw?.overallAverage || 0).toFixed(2);

    res.json({
      name: teacher.Name || teacher.name || "",
      surname: teacher.Surname || teacher.surname || "",
      ratedNumbers,
      lessonTypes,
      overallAverage
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: "teacher" },
      attributes: ["id", "Name", "Surname"]
    });

    res.json(teachers);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
