const jwt = require("jsonwebtoken");
const axios = require("axios");

async function run() {
  try {
    const token = jwt.sign({ id: "65f05c8c9a81b2a95c468e2b" }, "secretkey", { expiresIn: "7d" });
    const resProj = await axios.get("http://localhost:3000/api/projects/all-projects");
    if (resProj.data.length === 0) return console.log("No projects");
    
    // find a project not created by this test user
    const project = resProj.data.find(p => p.createdBy !== "65f05c8c9a81b2a95c468e2b");
    if (!project) return console.log("No valid projects");

    const projectId = project._id;
    console.log("Trying to join", projectId);

    const res = await axios.post(`http://localhost:3000/api/projects/join-request/${projectId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    console.log(res.data);
  } catch(e) {
    if (e.response) {
       console.log("Response Error:");
       console.log(e.response.status, e.response.data);
    } else {
       console.log("Error:", e.message);
    }
  }
}
run();
