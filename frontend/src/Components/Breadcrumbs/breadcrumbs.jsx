import React from 'react'
import { Link } from 'react-router-dom'

import './breadcrumbs.css'

const Breadcrumbs = (props) => {
  const { product } = props
  console.log('breadcrumbs product:', product)

  return (
    <div className='breadcrumbs'>
      <div className="breadcrumbs-container">
        <Link to='/'>Home</Link>
        <Link to='/shop'>Shop</Link>
        <Link to={`/category/${product.category}`}>{product.category}</Link>
        <p>{product.name}</p>
      </div>
    </div>
  )
}
export default Breadcrumbs