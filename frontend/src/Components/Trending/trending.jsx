import React from 'react'
import data_product from '../Assets/data'
import Item from '../Item/item'

import './trending.css'

const Trending = () => {
  return (
    <div className="trending">
      <h2>Trending Women's Collection</h2>
      <hr />
      <div className="trending-items">
        {data_product.map((item) => (
          <Item key={item.id} image={item.image} name={item.name} old_price={item.old_price} new_price={item.new_price} />
        ))}
      </div>
    </div>
  )
}

export default Trending