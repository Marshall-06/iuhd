const { LessonAssignment, User, Lesson, TeacherRating, RatingAnswer, Faculty, Department, Rating } = require("../models/model");
const sequelize = require("../config/db");


exports.getTeachersByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) return res.status(400).json({ message: "groupId required" });

    const assignments = await LessonAssignment.findAll({
      where: { groupId },
      include: [
        { model: User, as: "teacher", attributes: ["id", "Name", "Surname"] },
        { model: Lesson, attributes: ["id", "name"] }
      ]
    });

    const teachers = assignments.map(a => ({
      teacherId: a.teacherId,
      name: `${a.teacher.Name} ${a.teacher.Surname}`,
      lessonId: a.lessonId,
      lessonName: a.Lesson.name,
      type: a.type
    }));

    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rateTeacher = async (req, res) => {
  try {
    const { teacherId, groupId, answers } = req.body;
    // answers = [{ questionId, value }]

    if (!teacherId || !groupId || !Array.isArray(answers) || !answers.length) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Get assignment
    const assignment = await LessonAssignment.findOne({
      where: { teacherId, groupId }
    });
    if (!assignment) return res.status(400).json({ message: "Teacher not assigned to this group" });

    // ✅ CALCULATE AVERAGE SCORE
const avgScore = parseFloat(
  (answers.reduce((sum, a) => sum + Number(a.value), 0) / answers.length).toFixed(2)
);

const rating = await TeacherRating.create({
  teacherId,
  lessonId: assignment.lessonId,
  groupId,
  type: assignment.type,
  avgScore
});

    // Save answers
    for (const a of answers) {
  await RatingAnswer.create({
    ratingId: rating.id,
    questionId: a.questionId,
    value: a.value
  });
}

    res.status(201).json({
      message: "Rating submitted successfully",
      avgScore: avgScore.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getTeacherRatingSummary = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = await User.findOne({
      where: { id: teacherId, role: "teacher" },
      include: [
        { model: Faculty, attributes: ["name"] },
        { model: Department, attributes: ["name"] }
      ]
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
      faculty: teacher.Faculty?.name || "",
      department: teacher.Department?.name || "",
      ratedNumbers,
      lessonTypes,
      overallAverage
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
