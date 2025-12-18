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

  facultyId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
    //only for students
  studentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
});


const Faculty = sequelize.define("Faculty", {
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


const Department = sequelize.define("Department", {
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

Faculty.hasMany(User, { foreignKey: "facultyId" });
User.belongsTo(Faculty, { foreignKey: "facultyId" });



module.exports = { 
    User, 
    Faculty, 
    Department,
    Group
  };