const express = require("express")
const app = express()
require("dotenv").config()
const PORT = process.env.PORT 


app.use(express.json())

app.get("/", (req, res)=> {
    res.send("Hello World!")
})

app.use('/api/auth',require("./routers/authRouter"))
app.use("/api/faculty", require("./routers/facultyRouter"))
app.use("/api/department", require("./routers/departmentRouter"))


app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})