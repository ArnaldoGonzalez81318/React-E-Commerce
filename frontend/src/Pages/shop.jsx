import React from 'react'
import Hero from '../Components/Home/home'
import Trending from '../Components/Trending/trending'
import Offers from '../Components/Offers/offers'

const Shop = () => {
  return (
    <div className="shop">
      <Hero />
      <Trending />
      <Offers />
    </div>
  )
}

export default Shop