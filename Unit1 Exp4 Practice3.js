const express = require("express");
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// In-memory seat storage (5 seats for example)
let seats = {
  1: { status: "available" },
  2: { status: "available" },
  3: { status: "available" },
  4: { status: "available" },
  5: { status: "available" },
};

// Temporary locks storage
let seatLocks = {}; // { seatId: timeoutId }

app.get("/seats", (req, res) => {
  res.status(200).json(seats);
});

app.post("/lock/:id", (req, res) => {
  const seatId = req.params.id;

  if (!seats[seatId]) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seats[seatId].status === "booked") {
    return res.status(400).json({ message: "Seat already booked!" });
  }

  if (seats[seatId].status === "locked") {
    return res.status(400).json({ message: "Seat already locked by another user!" });
  }

  // Lock the seat
  seats[seatId].status = "locked";

  // Set a timeout to auto-unlock after 1 minute
  seatLocks[seatId] = setTimeout(() => {
    seats[seatId].status = "available";
    delete seatLocks[seatId];
    console.log(`Seat ${seatId} automatically unlocked after 1 minute.`);
  }, 60000); // 1 minute = 60000ms

  res.status(200).json({ message: `Seat ${seatId} locked successfully. Confirm within 1 minute.` });
});

// 🟦 POST - Confirm booking (must be locked first)
app.post("/confirm/:id", (req, res) => {
  const seatId = req.params.id;

  if (!seats[seatId]) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seats[seatId].status !== "locked") {
    return res.status(400).json({ message: "Seat is not locked and cannot be booked" });
  }

  // Confirm the booking
  seats[seatId].status = "booked";

  // Clear lock timer
  clearTimeout(seatLocks[seatId]);
  delete seatLocks[seatId];

  res.status(200).json({ message: `Seat ${seatId} booked successfully!` });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Concurrent Ticket Booking System API!");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
