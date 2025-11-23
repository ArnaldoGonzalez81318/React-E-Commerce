import React, { useContext, useMemo } from 'react'
import data_product from '../Assets/data'
import Item from '../Item/item'
import { ShopContext } from '../../Context/shopContext'

import './relatedProducts.css'

const RelatedProducts = ({ category, excludeId }) => {
  const { allProducts } = useContext(ShopContext)

  const curatedProducts = useMemo(() => {
    const source = allProducts?.length ? allProducts : data_product
    if (!source?.length) return []

    let filtered = source.filter(item => item.id !== excludeId)
    if (category) {
      const sameCategory = filtered.filter(item => item.category === category)
      if (sameCategory.length) filtered = sameCategory
    }
    return filtered.slice(0, 4)
  }, [allProducts, category, excludeId])

  return (
    <div className="related-products">
      <div className="related-products-head">
        <p className="eyebrow">You may also like</p>
        <h2>Related products</h2>
      </div>
      <div className="related-products-container">
        {curatedProducts.map(product => (
          <Item
            key={product.id || product._id}
            id={product.id}
            _id={product._id}
            image={product.image}
            name={product.name}
            old_price={product.old_price}
            new_price={product.new_price}
          />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts