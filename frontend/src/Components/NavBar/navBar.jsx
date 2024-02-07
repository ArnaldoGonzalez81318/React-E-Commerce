import React, { useState } from 'react'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import './navBar.css'

export const NavBar = () => {
  const [menu, setMenu] = useState("Shop All")
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="logo" />
        <h1>Shop</h1>
      </div>
      <ul className='navbar-menu'>
        <li onClick={() => setMenu("Shop All")} className={menu === "Shop All" ? "active" : ""}>Shop All</li>
        <li onClick={() => setMenu("Mens")} className={menu === "Mens" ? "active" : ""}>Mens</li>
        <li onClick={() => setMenu("Womens")} className={menu === "Womens" ? "active" : ""}>Womens</li>
        <li onClick={() => setMenu("Kids")} className={menu === "Kids" ? "active" : ""}>Kids</li>
      </ul>
      <div className="navbar-login-cart">
        <button
          className="navbar-login-btn"
          onClick={() => alert('Login')}>
          Login
        </button>
        <img src={cart_icon} alt="cart" />
        <span className="cart-count">0</span>
      </div>
    </div>
  )
}

export default NavBar