const bcrypt = require("bcrypt");
const { User } = require("../models/model");
const { sign } = require("jsonwebtoken");


exports.register = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !["admin", "teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // ADMIN → needs email + password
    if (role === "admin") {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required for admin" });
      }
      const hash = await bcrypt.hash(password, 10);
      const admin = await User.create({ email, password: hash, role });
      return res.status(201).json({ message: "Admin created", admin });
    }

    // TEACHER → needs email + password + other info
    if (role === "teacher") {
      const {  Name, Surname, facultyId, departmentId, groupId } = req.body;

      const teacher = await User.create({
        role,
        Name,
        Surname,
        facultyId,
        departmentId,
        groupId
      });

      return res.status(201).json({ message: "Teacher registered", teacher });
    }

    // STUDENT → only studentId
    if (role === "student") {
      let { studentId } = req.body;
      if (!studentId) {
        return res.status(400).json({ message: "studentId is required for student" });
      }

      studentId = parseInt(studentId, 10);
      if (isNaN(studentId)) {
        return res.status(400).json({ message: "studentId must be an integer" });
      }

      const student = await User.create({ role, studentId });
      return res.status(201).json({ message: "Student registered", student });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.studentRegister = async (req, res) => {
//   try{
//     const { role,studentId } = req.body;

//     if (!studentId) {
//       return res.status(400).json({ message: "studentId is required for student" });
//     }

//     const student = await User.create({ role, studentId});
//     return res.status(201).json({ message: "Student registered", student});
//   } catch (err){
//     res.status(500).json({ error: err.message});
//   }
// }



exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ where: { email } });
    if (!admin) {
      return res.status(400).json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" });
    }

    const passwordIsValid = bcrypt.compareSync(password, admin.password);
    if (!passwordIsValid) {
      return res.status(400).json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" });
    }

    const token = sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

exports.loginStudent = async (req, res) => {
  const { studentId } = req.body;
  try {
    const user = await User.findOne({ where: { studentId } });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Ulanyjynyň nomeri ýa-da açar sözi nädogry" });
    }

    const token = sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};