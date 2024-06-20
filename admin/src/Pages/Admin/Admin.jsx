// import React from 'react'
import Sidebar from '../../Components/Sidebar/Sidebar'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ProductList from '../../Components/ProductList/ProductList'
import { Routes, Route } from 'react-router-dom'
import './Admin.css'

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/product-list" element={<ProductList />} />
        </Routes>
      </div>
    </div>
  )
}

export default Admin