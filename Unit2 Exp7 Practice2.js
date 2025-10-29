import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // {id, name, price, quantity}
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalAmount += action.payload.price;
    },
    removeFromCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload);
      if (existingItem) {
        state.totalAmount -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter(item => item.id !== action.payload);
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        state.totalAmount += item.price;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalAmount -= item.price;
      }
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';

const products = [
  { id: 1, name: 'Laptop', price: 85000 },
  { id: 2, name: 'Smartphone', price: 40000 },
  { id: 3, name: 'Headphones', price: 2500 },
  { id: 4, name: 'Keyboard', price: 1500 }
];

const ProductList = () => {
  const dispatch = useDispatch();

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛒 Product Catalog</h2>
      <div style={styles.grid}>
        {products.map(product => (
          <div key={product.id} style={styles.card}>
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <button
              onClick={() => dispatch(addToCart(product))}
              style={styles.button}
            >
              Add to Cart
            </button>
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
  card: { border: '1px solid #ddd', padding: '1rem 2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '180px' },
  button: { background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' },
};

export default ProductList;
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../features/cartSlice';

const Cart = () => {
  const { items, totalAmount } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛍️ Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {items.map(item => (
            <div key={item.id} style={styles.item}>
              <div>
                <strong>{item.name}</strong> — ₹{item.price} × {item.quantity}
              </div>
              <div>
                <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
                <button onClick={() => dispatch(decreaseQuantity(item.id))}>−</button>
                <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
              </div>
            </div>
          ))}
          <h3>Total: ₹{totalAmount}</h3>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', padding: '2rem' },
  heading: { fontSize: '1.8rem', marginBottom: '1rem' },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '1rem auto',
    width: '50%',
    padding: '0.5rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
};

export default Cart;
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
import React from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

function App() {
  return (
    <div>
      <ProductList />
      <Cart />
    </div>
  );
}

export default App;
