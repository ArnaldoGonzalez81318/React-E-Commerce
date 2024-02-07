import React from 'react'
import hand_icon from '../Assets/hand_icon.png'
import arrow from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'

import './home.css'

const Home = () => {
  return (
    <div className="home">
      <div className="home-left">
        <h2>New Arrivals</h2>
        <p>Shop the latest arrivals
          <br
          />from our collection</p>
        <button>Shop Now</button>
        <div className="home-hand-icon">
          <p>New</p>
          <img src={hand_icon} alt="hand icon" />
        </div>
        <div className="home-arrow">
          <img src={arrow} alt="arrow" />
        </div>
      </div>
      <div className="home-right">
        <img src={hero_image} alt="hero" />
      </div>
    </div>
  )
}

export default Home