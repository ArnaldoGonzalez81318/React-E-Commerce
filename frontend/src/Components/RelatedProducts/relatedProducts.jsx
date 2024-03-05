import React from 'react'
import data_product from '../Assets/data'
import Item from '../Item/item'

import './relatedProducts.css'

const RelatedProducts = () => {
  return (
    <div className="related-products">
      <h2>Related Products</h2>
      <hr />
      <div className="related-products-container">
        {data_product.map((product) => {
          return (
            <Item
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              old_price={product.old_price}
              new_price={product.new_price}
            />
          )
        })}
      </div>
    </div>
  )
}

export default RelatedProducts