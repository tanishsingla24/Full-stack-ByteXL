const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello from Node.js backend running on AWS EC2!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://<YOUR_BACKEND_PUBLIC_DNS>:5000/")
      .then((res) => setMessage(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>React Frontend Deployed on AWS</h1>
      <h2>{message}</h2>
    </div>
  );
}

export default App;
