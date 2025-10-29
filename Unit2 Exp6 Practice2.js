import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

// -------------------- Configuration --------------------
const SECRET_KEY = "supersecretkey"; // for signing JWTs (keep safe)
let accountBalance = 1000; // simple in-memory balance
const users = {
  user1: "password123" // hardcoded username/password
};

// -------------------- 1️⃣ Login Route --------------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required." });

  // Check hardcoded credentials
  if (users[username] !== password)
    return res.status(401).json({ error: "Invalid username or password." });

  // Generate JWT token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ message: "Login successful!", token });
});

// -------------------- 2️⃣ JWT Verification Middleware --------------------
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ error: "Authorization header missing" });

  const token = authHeader.split(" ")[1]; // Bearer <token>

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user; // attach decoded user info
    next();
  });
};

// -------------------- 3️⃣ Protected Banking Routes --------------------

// 🧾 Check Balance
app.get("/balance", verifyToken, (req, res) => {
  res.json({ username: req.user.username, balance: accountBalance });
});

// 💰 Deposit Money
app.post("/deposit", verifyToken, (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0)
    return res.status(400).json({ error: "Deposit amount must be positive." });

  accountBalance += amount;
  res.json({
    message: `Deposited ₹${amount} successfully.`,
    newBalance: accountBalance
  });
});

// 💸 Withdraw Money
app.post("/withdraw", verifyToken, (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0)
    return res.status(400).json({ error: "Withdrawal amount must be positive." });

  if (amount > accountBalance)
    return res.status(400).json({ error: "Insufficient balance." });

  accountBalance -= amount;
  res.json({
    message: `Withdrawn ₹${amount} successfully.`,
    newBalance: accountBalance
  });
});

// -------------------- 4️⃣ Start Server --------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`Banking API running on port ${PORT}`));
