import React from 'react'
import arrow_icon from '../Assets/breadcrumb_arrow.png'

import './breadcrumbs.css'

const Breadcrumbs = (props) => {
  const { product } = props
  return (
    <div className='breadcrumbs'>
      <div className="breadcrumbs-container">
        <p>
          Home<img src={arrow_icon} alt="arrow" />
          Shop<img src={arrow_icon} alt="arrow" />
          {product.category}<img src={arrow_icon} alt="arrow" />
          {product.name}
        </p>
      </div>
    </div>
  )
}

export default Breadcrumbs