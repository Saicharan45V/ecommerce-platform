import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductsList from './components/ProductList';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductDetails from './components/ProductDetails';
import Myorders from './components/Myorders';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);

  // Fetch products for the home page
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => {
        if (!res.ok) throw new Error("Backend returned an error");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="app-container">
        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={<ProductsList products={products} />} />

          {/* Dedicated Cart Page Route */}
          <Route path="/cart" element={<Cart />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/orders" element={<Myorders />} />
        </Routes>
      </div>
    </>
  );
}

export default App;