// import React from 'react'
import { Link } from 'react-router-dom'
import addProductIcon from '../../assets/product_cart.svg'
import listProductIcon from '../../assets/product_list.svg'
import './Sidebar.css'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/add-product" className="link">
              <li className="sidebarListItem">
                <img src={addProductIcon} alt="Add Product" className="sidebarIcon" />
                <span className="sidebarListItemText">Add Product</span>
              </li>
            </Link>
            <Link to="/product-list" className="link">
              <li className="sidebarListItem">
                <img src={listProductIcon} alt="List Product" className="sidebarIcon" />
                <span className="sidebarListItemText">Product List</span>
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
        </div>
      </div>
    </div>
  )
}

export default Sidebar