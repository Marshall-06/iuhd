const sequelize = require("../config/db"); 
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "group_id"
  },

  role: {
    type: DataTypes.ENUM("admin", "teacher", "student"),
    allowNull: false
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Surname: {
    type: DataTypes.STRING,
    allowNull: true
  },

  //only for teachers
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },

  surname: {
    type: DataTypes.STRING,
    allowNull: true
   },

  // facultyId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true
  // },

  // departmentId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true
  // },
    //only for students
  // studentId: {
  //     type: DataTypes.INTEGER,
  //     allowNull: true
  //   },
});


// const Faculty = sequelize.define("Faculty", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   }
// });


// const Department = sequelize.define("Department", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   }
// });

const Group = sequelize.define("Group", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// const Lesson = sequelize.define("Lesson", {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   }
// });

const LessonAssignment = sequelize.define("LessonAssignment", {
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "group_id"
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "teacher_id"
    },
    type: {
      type: DataTypes.ENUM("lecture", "seminar", "practice"),
      allowNull: false
    }
  },
  {
    tableName: "lesson_assignments",
    timestamps: false
  
});


const TeacherRating = sequelize.define(
  "TeacherRating",
  {
    teacherId: { type: DataTypes.INTEGER, allowNull: false, field: "teacher_id" },
    // lessonId: { type: DataTypes.INTEGER, allowNull: true, field: "lesson_id" },
    groupId: { type: DataTypes.INTEGER, allowNull: false, field: "group_id" },
    type: {
      type: DataTypes.ENUM("lecture", "seminar", "practice"),
      allowNull: false
    },
    avgScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "avg_score"
    }
  },
  {
    tableName: "teacher_ratings",
    timestamps: false
  }
);



const RatingAnswer = sequelize.define(
  "RatingAnswer",
  {
    ratingId: { type: DataTypes.INTEGER, allowNull: false, field: "rating_id" },
    questionId: { type: DataTypes.INTEGER, allowNull: false, field: "question_id" },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    }
  },
  {
    tableName: "rating_answers",
    timestamps: false
  }
);

const Question = sequelize.define(
  "Question",
  {
    text: { type: DataTypes.STRING, allowNull: false }
  },
  { tableName: "questions", timestamps: false }
);


// Faculty & Department
// Faculty.hasMany(User, { foreignKey: "facultyId" });
// User.belongsTo(Faculty, { foreignKey: "facultyId" });

// Department.hasMany(User, { foreignKey: "departmentId" });
// User.belongsTo(Department, { foreignKey: "departmentId" });


// User & LessonAssignment
User.hasMany(LessonAssignment, { foreignKey: "teacherId" });
LessonAssignment.belongsTo(User, { foreignKey: "teacherId", as: "teacher" });


// LessonAssignment & Lesson / Group
// LessonAssignment.belongsTo(Lesson, { foreignKey: "lessonId" });
// Lesson.hasMany(LessonAssignment, { foreignKey: "lessonId" });

LessonAssignment.belongsTo(Group, { foreignKey: "groupId" });
Group.hasMany(LessonAssignment, { foreignKey: "groupId" });


// TeacherRating
User.hasMany(TeacherRating, {
  foreignKey: "teacherId",
  as: "ratings"
});

TeacherRating.belongsTo(User, {
  foreignKey: "teacherId",
  as: "teacher"
});

// TeacherRating.belongsTo(Lesson, { foreignKey: "lessonId" });
// TeacherRating.belongsTo(Group, { foreignKey: "groupId" });


// RatingAnswer
TeacherRating.hasMany(RatingAnswer, { foreignKey: "ratingId" });
RatingAnswer.belongsTo(TeacherRating, { foreignKey: "ratingId" });

RatingAnswer.belongsTo(Question, { foreignKey: "questionId" });
Question.hasMany(RatingAnswer, { foreignKey: "questionId" });

User.hasMany(Group, { foreignKey: "groupId" });
Group.belongsTo(User, { foreignKey: "groupId" });



module.exports = { 
    User, 
    // Faculty, 
    // Department,
    Group,
    // Lesson,
    LessonAssignment,
    TeacherRating,
    Question,
    RatingAnswer
  };