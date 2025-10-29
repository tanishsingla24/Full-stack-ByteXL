import express from "express";
const app = express();

app.use(express.json());

/* -------------------- 1️⃣ Logging Middleware -------------------- */
// Logs method, URL, and timestamp for every request
const requestLogger = (req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next(); // continue to next middleware or route
};

app.use(requestLogger); // apply globally

/* -------------------- 2️⃣ Authentication Middleware -------------------- */
// Checks for Bearer token in Authorization header
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (token !== "mysecrettoken") {
    return res.status(403).json({ error: "Invalid or missing Bearer token" });
  }

  next(); // valid token -> move to protected route
};

/* -------------------- 3️⃣ Routes -------------------- */

// ✅ Public Route (no authentication)
app.get("/public", (req, res) => {
  res.json({ message: "Welcome! This is a public route accessible by anyone." });
});

// 🔒 Protected Route (requires Bearer token)
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Access granted! You have reached the protected route." });
});

/* -------------------- 4️⃣ Start Server -------------------- */
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
