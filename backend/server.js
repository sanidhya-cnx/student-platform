const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");


const port = 3000
const cors = require("cors");
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  
  socket.on("joinProject", (projectId) => {
    socket.join(`project-${projectId}`);
  });

  socket.on("leaveProject", (projectId) => {
    socket.leave(`project-${projectId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});
mongoose.connect("mongodb://localhost:27017/studentPlatform")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/users", userRoutes)
app.use("/api/v1/project", projectRoutes)

app.get("/", (req, res) => {
    console.log("home is accessed")
    res.send("this is home page")
})

server.listen(port, ()=>{
    console.log(`server is running on ${port}`)
})