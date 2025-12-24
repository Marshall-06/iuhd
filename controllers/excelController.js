const ExcelJS = require("exceljs");
const { User, TeacherRating } = require("../models/model");
const sequelize = require("../config/db");

exports.exportTeacherRatingsToExcel = async (req, res) => {
  try {
    const teachers = await User.findAll({
      where: { role: "teacher" },
      attributes: ["id", "Name", "Surname"]
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Teacher Ratings");

    // Excel columns
    worksheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Surname", key: "surname", width: 20 },
      { header: "Rated Numbers", key: "ratedNumbers", width: 15 },
      { header: "Lecture", key: "lecture", width: 12 },
      { header: "Practice", key: "practice", width: 12 },
      { header: "Seminar", key: "seminar", width: 12 },
      { header: "Overall Average", key: "overall", width: 15 }
    ];

    for (const teacher of teachers) {
      const ratedNumbers = await TeacherRating.count({ where: { teacherId: teacher.id } });

      // Initialize scores to 0
      const scores = { lecture: 0, practice: 0, seminar: 0 };

      // Get averages for each lesson type
      const ratings = await TeacherRating.findAll({
        where: { teacherId: teacher.id },
        attributes: [
          "type",
          [sequelize.fn("AVG", sequelize.col("avg_score")), "avgScore"]
        ],
        group: ["type"],
        raw: true
      });

      ratings.forEach(r => {
        if (r.type && r.avgScore !== null) {
          scores[r.type] = parseFloat(r.avgScore);
        }
      });

      // Calculate overall average (only for types that have ratings)
      const ratedTypes = Object.values(scores).filter(v => v > 0);
      const overall = ratedTypes.length > 0
        ? ratedTypes.reduce((a, b) => a + b, 0) / ratedTypes.length
        : 0;

      worksheet.addRow({
        name: teacher.Name,
        surname: teacher.Surname,
        ratedNumbers,
        lecture: scores.lecture.toFixed(2),
        practice: scores.practice.toFixed(2),
        seminar: scores.seminar.toFixed(2),
        overall: overall.toFixed(2)
      });
    }

    // Unique filename to avoid Windows lock
    const fileName = `teacher_ratings_${Date.now()}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
