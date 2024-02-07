import React from 'react'
import exclusive_image from '../Assets/exclusive_image.png'
import './offers.css'

const Offers = () => {
  return (
    <div className="offers">
      <div className="offers-left">
        <h2>Exclusive Offers</h2>
        <p>Get the best deals on our exclusive collection</p>
        <button>Shop Now</button>
      </div>
      <div className="offers-right">
        <img src={exclusive_image} alt="exclusive" />
      </div>
    </div>
  )
}

export default Offers