import React, { useState } from 'react'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import './navBar.css'
import { Link } from 'react-router-dom'

export const NavBar = () => {
  const [menu, setMenu] = useState("Shop All")
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="logo" />
        <h1>Shop</h1>
      </div>
      <ul className='navbar-menu'>
        <li onClick={() => setMenu("Shop All")} className={menu === "Shop All" ? "active" : ""}>
          <Link to="/">Shop All</Link>
        </li>
        <li onClick={() => setMenu("Mens")} className={menu === "Mens" ? "active" : ""}>
          <Link to="mens">Mens</Link>
        </li>
        <li onClick={() => setMenu("Womens")} className={menu === "Womens" ? "active" : ""}>
          <Link to="womens">Womens</Link>
        </li>
        <li onClick={() => setMenu("Kids")} className={menu === "Kids" ? "active" : ""}>
          <Link to="kids">Kids</Link>
        </li>
      </ul>
      <div className="navbar-login-cart">
        <Link to="login" >
          <button className="navbar-login-btn">Login</button>
        </Link>
        <Link to="cart">
          <img src={cart_icon} alt="cart" />
          <span className="cart-count">0</span>
        </Link>
      </div>
    </div>
  )
}

export default NavBar