import React from 'react'
import { Link } from 'react-router-dom'
import arrow_icon from '../Assets/breadcrumb_arrow.png'

import './breadcrumbs.css'

const Breadcrumbs = (props) => {
  const { product } = props
  return (
    <div className='breadcrumbs'>
      <div className="breadcrumbs-container">
        <Link to='/'>Home</Link>
        <img src={arrow_icon} alt="arrow" />
        <Link to='/shop'>Shop</Link>
        <img src={arrow_icon} alt="arrow" />
        <Link to={`/category/${product.category}`}>{product.category}</Link>
        <img src={arrow_icon} alt="arrow" />
        <p>{product.name}</p>
      </div>
    </div>
  )
}
export default Breadcrumbs