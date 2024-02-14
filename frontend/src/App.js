import React from 'react';
import './App.css';
import NavBar from './Components/NavBar/navBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/shop';
import ShopCategory from './Pages/shopCategory';
import Product from './Pages/product';
import LoginSignup from './Pages/loginSignup';
import Cart from './Pages/cart';
import Footer from './Components/Footer/footer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="mens" element={<ShopCategory category="mens" />} />
          <Route path="womens" element={<ShopCategory category="womens" />} />
          <Route path="kids" element={<ShopCategory category="kids" />} />
          <Route path="product/" element={<Product />}>
            <Route path=":id" element={<Product />} />
          </Route>
          <Route path="login" element={<LoginSignup />} />
          <Route path="cart" element={<Cart />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
