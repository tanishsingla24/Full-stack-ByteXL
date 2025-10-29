const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Sample product data
const products = [
  { id: 1, name: 'Laptop', price: 85000 },
  { id: 2, name: 'Smartphone', price: 40000 },
  { id: 3, name: 'Headphones', price: 2500 },
  { id: 4, name: 'Keyboard', price: 1500 }
];

// API route to get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="text-gray-600 text-lg">Loading products...</p>;
  if (error) return <p className="text-red-500 text-lg">{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛍️ Product List</h2>
      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p.id} style={styles.card}>
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', padding: '2rem' },
  heading: { fontSize: '1.8rem', marginBottom: '1rem' },
  grid: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' },
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '1rem 2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '180px'
  }
};

export default ProductList;
import React from 'react';
import ProductList from './components/ProductList';

function App() {
  return (
    <div>
      <ProductList />
    </div>
  );
}

export default App;
