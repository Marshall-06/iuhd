const express = require("express")
const app = express()
require("dotenv").config()
const PORT = process.env.PORT 
const cors = require("cors");



app.use(express.json())
app.use(express.static("public"))
app.use(cors());

app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/public/index.html")
})




app.use('/api/auth',require("./routers/authRouter"))
// app.use("/api/faculty", require("./routers/facultyRouter"))
// app.use("/api/department", require("./routers/departmentRouter"))
app.use("/api/group", require("./routers/groupRouter"))
// app.use("/api/lesson", require("./routers/lessonRouter"))
app.use("/api/assignment", require("./routers/leesonAssigmentRouter"))
app.use("/api/teacher", require("./routers/teacherRouter"))
app.use("/api/question", require("./routers/questionRouter"))
app.use("/api/excel", require("./routers/excelRouter"))

app.listen(PORT,"0.0.0.0",() => {
    console.log(`Server running ${PORT} port`)
})