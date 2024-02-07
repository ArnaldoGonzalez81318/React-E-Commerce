import React from 'react'

import './item.css'

const Item = (props) => {
  return (
    <div className="item">
      <div className="item-image">
        <img src={props.image} alt="item" />
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