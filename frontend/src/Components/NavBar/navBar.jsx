import React, { useContext, useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../Context/shopContext';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Sling as Hamburger } from 'hamburger-react';

import './navBar.css';

export const NavBar = () => {
  const { cartItems } = useContext(ShopContext); // get the cart items
  const menuRef = useRef(); // reference to the menu
  const location = useLocation(); // get the current location

  // Get the menu name based on the path
  const getPathMenu = (path) => {
    switch (path) {
      case 'men':
        return 'Men';
      case 'women':
        return 'Women';
      case 'kids':
        return 'Kids';
      default:
        return 'Shop All';
    }
  };

  const [menu, setMenu] = useState(getPathMenu(location.pathname.split('/')[1]));

  // Toggle the dropdown menu
  const dropdownToggle = (e) => {
    menuRef.current.classList.toggle("navbar-menu-visible"); // toggle the menu
    e.target.classList.toggle("navbar-dropdown-active"); // toggle the dropdown icon
  };

  // Close the dropdown menu when the user clicks outside of it
  useEffect(() => {
    setMenu(getPathMenu(location.pathname.split('/')[1]));
  }, [location]);

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="logo" />
        <h1>Shop</h1>
      </div>
      <div className="navbar-dropdown-icon" onClick={dropdownToggle}>
        <Hamburger size={20} />
      </div>
      <ul className="navbar-menu" ref={menuRef}>
        <li onClick={() => setMenu("Shop All")} className={menu === "Shop All" ? "active" : ""}>
          <Link to="/">Shop All</Link>
        </li>
        <li onClick={() => setMenu("Men")} className={menu === "Men" ? "active" : ""}>
          <Link to="/men">Men</Link>
        </li>
        <li onClick={() => setMenu("Women")} className={menu === "Women" ? "active" : ""}>
          <Link to="/women">Women</Link>
        </li>
        <li onClick={() => setMenu("Kids")} className={menu === "Kids" ? "active" : ""}>
          <Link to="/kids">Kids</Link>
        </li>
      </ul>
      <div className="navbar-login-cart">
        {localStorage.getItem('authToken') ? (
          <button className='navbar-logout-btn' onClick={() => {
            localStorage.removeItem('authToken');
            window.location.replace('/');
          }}>Logout</button>
        ) : (
          <Link to="/login">
            <button className="navbar-login-btn">Login</button>
          </Link>
        )}
        <Link to="/cart">
          <img src={cart_icon} alt="cart" />
          <span className="cart-count">
            {Object.values(cartItems).reduce((a, b) => a + b, 0)}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;