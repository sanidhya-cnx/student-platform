const jwt = require("jsonwebtoken");

async function run() {
  try {
    const token = jwt.sign({ id: "69bcc1b09cc4ea4b2c7858bc" }, "secretkey");
    const res = await fetch(`http://localhost:3000/api/projects/join-request/69bd5050152f6161871a3f41`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token }
    });
    
    const bodyText = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", bodyText);
  } catch(e) {
    console.error(e);
  }
}
run();
