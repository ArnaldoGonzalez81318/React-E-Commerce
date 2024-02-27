import React from 'react'
import { Link } from 'react-router-dom'

import './item.css'

const Item = (props) => {
  return (
    <div className="item">
      <div className="item-image">
        <Link to={`/product/${props.id}`}>
          <img src={props.image} alt={props.name} onClick={() => window.scrollTo(0, 0)} />
        </Link>
      </div>
      <div className="item-details">
        <h3>{props.name}</h3>
        <div className="item-price">
          <p className="item-price-old">${props.old_price}</p>
          <p className="item-price-new">${props.new_price}</p>
        </div>
      </div>
    </div>
  )
}

export default Item