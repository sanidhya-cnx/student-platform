const express = require('express')
const app = express()
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const port = 3000
const cors = require("cors");
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/studentPlatform")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use(express.json())
app.use("/api/users", userRoutes)

const projectRoutes = require("./routes/projectRouter")
app.use("/api/v1/project", projectRoutes)

app.get("/", (req, res) => {
    console.log("home is accessed")
    res.send("this is home page")
})

app.listen(port, ()=>{
    console.log(`server is running on ${port}`)
})