import { useEffect, useState } from 'react'
import './ProductList.css'

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data)
        // Check if the fetched data is an array, if not set an empty array
        setAllProducts(Array.isArray(data.products) ? data.products : [])
        setLoading(false)
      })
      .catch(err => {
        console.log('Error:', err)
        setLoading(false)
      })
  }, [])

  const renderProductListItems = () => {
    if (loading) {
      return <p>Loading...</p>
    }

    return allProducts.map(product => (
      <div key={product.id} className="product-list-item">
        <img src={product.image} alt={product.name} className="product-list-item-image" />
        <p>{product.name}</p>
        <p>{product.old_price}</p>
        <p>{product.new_price}</p>
        <p>{product.category}</p>
        <p>
          <button className="product-list-item-delete-btn">Delete</button>
        </p>
      </div>
    ))
  }

  return (
    <div className="product-list">
      <div className="product-list-wrapper">
        <h2 className="product-list-title">Product List</h2>
        <div className="product-list-main">
          <p>Products</p>
          <p>Title</p>
          <p>Old Price</p>
          <p>New Price</p>
          <p>Category</p>
          <p>Delete</p>
        </div>
        <div className="product-list-items">
          {renderProductListItems()}
        </div>
      </div>
    </div>
  )
}

export default ProductList