const ExcelJS = require("exceljs");
const { User, Faculty, Department, TeacherRating } = require("../models/model"); 
const sequelize = require("../config/db");

exports.exportTeacherRatingsToExcel = async (req, res) => {
  try {
    // Fetch all teachers
    const teachers = await User.findAll({
      where: { role: "teacher" },
      include: [
        { model: Faculty, attributes: ["name"] },
        { model: Department, attributes: ["name"] }
      ]
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Teacher Ratings");

    // Add headers
    worksheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Surname", key: "surname", width: 20 },
      { header: "Faculty", key: "faculty", width: 25 },
      { header: "Department", key: "department", width: 25 },
      { header: "Rated Numbers", key: "ratedNumbers", width: 15 },
      { header: "Lesson Type", key: "lessonType", width: 20 },
      { header: "Average Score", key: "averageScore", width: 15 },
      { header: "Overall Average", key: "overallAverage", width: 15 }
    ];

    // Loop through each teacher
    for (const teacher of teachers) {
      const ratedNumbers = await TeacherRating.count({
        where: { teacherId: teacher.id }
      });

      const overallRaw = await TeacherRating.findOne({
        where: { teacherId: teacher.id },
        attributes: [[sequelize.fn("AVG", sequelize.col("avg_score")), "overallAverage"]],
        raw: true
      });

      const lessonTypesRaw = await TeacherRating.findAll({
        where: { teacherId: teacher.id },
        attributes: ["type", [sequelize.fn("AVG", sequelize.col("avg_score")), "averageScore"]],
        group: ["type"],
        raw: true
      });

      const overallAverage = parseFloat(overallRaw?.overallAverage || 0).toFixed(2);

      // Add one row per lesson type
      for (const lesson of lessonTypesRaw) {
        worksheet.addRow({
          name: teacher.Name || teacher.name,
          surname: teacher.Surname || teacher.surname,
          faculty: teacher.Faculty?.name || "",
          department: teacher.Department?.name || "",
          ratedNumbers,
          lessonType: lesson.type,
          averageScore: parseFloat(lesson.averageScore).toFixed(2),
          overallAverage
        });
      }
    }

    // Send Excel file as response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=teacher_ratings.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
