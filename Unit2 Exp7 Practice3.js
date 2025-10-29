const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Receive message from a user
  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    // Broadcast message to all connected users
    io.emit("receive_message", data);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Server is running for real-time chat!");
});

const PORT = 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
import React from "react";
import Chat from "./Chat";

function App() {
  return (
    <div className="app">
      <h1>💬 Real-Time Chat Application</h1>
      <Chat />
    </div>
  );
}

export default App;
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function Chat() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for messages from the server
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (name && message) {
      const msgData = {
        name,
        message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit("send_message", msgData);
      setMessage("");
    }
  };

  return (
    <div className="chat-container" style={styles.container}>
      {!name ? (
        <div style={styles.nameContainer}>
          <h3>Enter your name to join chat</h3>
          <input
            type="text"
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>
      ) : (
        <>
          <div style={styles.chatBox}>
            {messages.map((msg, index) => (
              <div key={index} style={styles.message}>
                <strong>{msg.name}</strong>: {msg.message}{" "}
                <span style={styles.time}>({msg.time})</span>
              </div>
            ))}
          </div>

          <div style={styles.inputContainer}>
            <input
              type="text"
              value={message}
              placeholder="Type a message..."
              onChange={(e) => setMessage(e.target.value)}
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.button}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    margin: "30px auto",
    width: "400px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  chatBox: {
    height: "300px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#fff",
  },
  inputContainer: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  message: {
    margin: "5px 0",
    padding: "5px",
    background: "#e8f0fe",
    borderRadius: "5px",
  },
  nameContainer: { textAlign: "center" },
  time: { color: "#888", fontSize: "0.8em" },
};

export default Chat;
