const express = require('express');
const app = express();

app.use(express.json()); // To handle JSON request bodies

let cards = [
  { id: 1, suit: 'Hearts', value: 'Ace' },
  { id: 2, suit: 'Spades', value: 'King' },
  { id: 3, suit: 'Diamonds', value: 'Queen' }
];

// List all cards
app.get('/cards', (req, res) => {
  res.status(200).json(cards);
});

// Retrieve a specific card by ID
app.get('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const card = cards.find(c => c.id === id);
  if (card) {
    res.status(200).json(card);
  } else {
    res.status(404).json({ error: 'Card not found' });
  }
});

// Add a new card
app.post('/cards', (req, res) => {
  const { suit, value } = req.body;
  const newCard = {
    id: cards.length ? cards[cards.length - 1].id + 1 : 1,
    suit,
    value
  };
  cards.push(newCard);
  res.status(201).json(newCard);
});

// Delete a card by ID
app.delete('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = cards.findIndex(c => c.id === id);
  if (index !== -1) {
    cards.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Card not found' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
