import React from 'react'
import Hero from '../Components/Home/home'
import Trending from '../Components/Trending/trending'
import Offers from '../Components/Offers/offers'
import NewCollections from '../Components/NewCollections/newCollections'

const Shop = () => {
  return (
    <div className="shop">
      <Hero />
      <Trending />
      <Offers />
      <NewCollections />
    </div>
  )
}

export default Shop