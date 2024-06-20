// import React from 'react'
import './ProductList.css'

const ProductList = () => {
  return (
    <div className="product-list">
      <div className="product-list-wrapper">
        <h2 className="product-list-title">Product List</h2>
        <table className="product-list-table">
          <thead>
            <tr>
              <th className="product-list-table-header">No</th>
              <th className="product-list-table-header">Name</th>
              <th className="product-list-table-header">Price</th>
              <th className="product-list-table-header">Description</th>
              <th className="product-list-table-header">Image</th>
            </tr>
          </thead>
          <tbody>
            <tr className="product-list-table-row">
              <td className="product-list-table-data">1</td>
              <td className="product-list-table-data">Product 1</td>
              <td className="product-list-table-data">1000</td>
              <td className="product-list-table-data">Description 1</td>
              <td className="product-list-table-data">Image 1</td>
            </tr>
            <tr className="product-list-table-row">
              <td className="product-list-table-data">2</td>
              <td className="product-list-table-data">Product 2</td>
              <td className="product-list-table-data">2000</td>
              <td className="product-list-table-data">Description 2</td>
              <td className="product-list-table-data">Image 2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductList