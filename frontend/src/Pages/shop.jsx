import React from 'react'
import Hero from '../Components/Home/home'
import Trending from '../Components/Trending/trending'
import Offers from '../Components/Offers/offers'
import NewCollections from '../Components/NewCollections/newCollections'
import Newsletters from '../Components/Newsletters/newsletters'
import Footer from '../Components/Footer/footer'

const Shop = () => {
  return (
    <div className="shop">
      <Hero />
      <Trending />
      <Offers />
      <NewCollections />
      <Newsletters />
      <Footer />
    </div>
  )
}

export default Shop