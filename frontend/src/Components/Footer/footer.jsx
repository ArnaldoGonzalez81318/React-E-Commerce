import React from 'react'
import { Link } from 'react-router-dom'
import footer_logo from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pinterest_icon from '../Assets/pinterest_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'

import './footer.css'

const Footer = () => {
  const date = new Date()
  const year = date.getFullYear()

  return (
    <div className="footer">
      <div className="footer-logo">
        <img src={footer_logo} alt="logo" />
        <h3>Shop</h3>
      </div>
      <ul className="footer-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/offers">Offers</Link></li>
        <li><Link to="/newcollections">New Collections</Link></li>
        <li><Link to="/newsletters">Newsletters</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
      <ul className="footer-social">
        <li>
          <Link to="https://www.instagram.com/">
            <img src={instagram_icon} alt="instagram" />
          </Link>
        </li>
        <li>
          <Link to="https://www.pinterest.com/">
            <img src={pinterest_icon} alt="pinterest" />
          </Link>
        </li>
        <li>
          <Link to="https://www.whatsapp.com/">
            <img src={whatsapp_icon} alt="whatsapp" />
          </Link>
        </li>
      </ul>
      <div className="footer-copyright">
        <hr />
        <p>&copy; {year} Shop. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer