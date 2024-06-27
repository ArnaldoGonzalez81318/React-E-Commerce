import React, { useState, useEffect } from 'react'
import Item from '../Item/item'

import './trending.css'

const Trending = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/trending-women')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data);
        setTrendingProducts(Array.from(data.trendingWomen));
      })
      .catch(err => {
        console.log('Error:', err);
      });
  }, []);

  return (
    <div className="trending">
      <h2>Trending Women's Collection</h2>
      <hr />
      <div className="trending-items">
        {trendingProducts.map((item) => (
          <Item key={item.id} image={item.image} name={item.name} old_price={item.old_price} new_price={item.new_price} />
        ))}
      </div>
    </div>
  )
}

export default Trending