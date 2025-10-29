const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Account = require('./models/Account');

const app = express();
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bankDB')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ➕ Create sample accounts (run once)
app.post('/create-account', async (req, res) => {
  try {
    const { username, balance } = req.body;
    const newAcc = new Account({ username, balance });
    await newAcc.save();
    res.status(201).json({ message: 'Account created successfully', account: newAcc });
  } catch (err) {
    res.status(500).json({ error: 'Error creating account', details: err.message });
  }
});

// 💸 Transfer money between two accounts
app.post('/transfer', async (req, res) => {
  const { fromUser, toUser, amount } = req.body;

  if (!fromUser || !toUser || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid input. Provide valid fromUser, toUser, and amount.' });
  }

  try {
    const sender = await Account.findOne({ username: fromUser });
    const receiver = await Account.findOne({ username: toUser });

    if (!sender) return res.status(404).json({ error: 'Sender account not found' });
    if (!receiver) return res.status(404).json({ error: 'Receiver account not found' });

    if (sender.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance in sender account' });
    }

    // Sequential updates to ensure logical consistency
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    res.json({
      message: 'Transfer successful',
      fromUser: { username: sender.username, newBalance: sender.balance },
      toUser: { username: receiver.username, newBalance: receiver.balance }
    });

  } catch (err) {
    res.status(500).json({ error: 'Error processing transfer', details: err.message });
  }
});

// 📊 Get account balance
app.get('/balance/:username', async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.params.username });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json({ username: account.username, balance: account.balance });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching balance', details: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
