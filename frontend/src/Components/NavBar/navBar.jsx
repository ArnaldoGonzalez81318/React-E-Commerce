import React, { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/shopContext'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Sling as Hamburger } from 'hamburger-react'

import './navBar.css'

export const NavBar = () => {
  const [menu, setMenu] = useState("Shop All")
  const { cartItems } = useContext(ShopContext)
  const menuRef = useRef()

  const dropdownToggle = (e) => {
    menuRef.current.classList.toggle("navbar-menu-visible") // toggle the menu
    e.target.classList.toggle("navbar-dropdown-active") // toggle the dropdown icon
  }

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
          <span className="cart-count">
            {Object.values(cartItems).reduce((a, b) => a + b, 0)}
          </span>
        </Link>
      </div>
    </div>
  )
}

export default NavBar