// import React from 'react'
import { Link } from 'react-router-dom'
import addProductIcon from '../../assets/product_cart.svg'
import listProductIcon from '../../assets/product_list.svg'
import './Sidebar.css'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-wrapper">
        <div className="sidebar-menu">
          <h3 className="sidebar-title">Product</h3>
          <ul className="sidebar-list">
            <Link to="/add-product" className="link">
              <li className="sidebar-list-item">
                <img src={addProductIcon} alt="Add Product" className="sidebar-list-item-icon" />
                <span className="sidebar-list-item-text">Add Product</span>
              </li>
            </Link>
            <Link to="/product-list" className="link">
              <li className="sidebar-list-item">
                <img src={listProductIcon} alt="List Product" className="sidebar-list-item-icon" />
                <span className="sidebar-list-item-text">List Product</span>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar