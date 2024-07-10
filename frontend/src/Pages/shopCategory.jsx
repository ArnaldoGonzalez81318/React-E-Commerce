import React, { useContext } from 'react';
import { ShopContext } from '../Context/shopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/item';

import './CSS/shopCategory.css'

const ShopCategory = (props) => {
  const { allProducts } = useContext(ShopContext);
  console.log('allProducts:', allProducts)

  // Ensure allProducts is defined and has elements before trying to filter or map
  const filteredProducts = allProducts?.filter((product) => product.category === props.category) || [];

  return (
    <div className="shop-category">
      <img className='shop-category-banner' src={props.banner} alt="banner" />
      <h2>{props.category}</h2>
      <div className="shop-category-sort">
        <p className="shop-category-sort-count">
          <span>
            Showing <strong style={{ color: '#ff6e6c' }}>
              {filteredProducts.length}
            </strong>
          </span>
          &nbsp;products out of&nbsp;
          <strong style={{ color: '#ff6e6c' }}>{allProducts?.length || 0}</strong>
        </p>
        <label htmlFor="sort">Sort by: <img src={dropdown_icon} alt="dropdown" /></label>
      </div>
      <div className="shop-category-products">
        {filteredProducts.map((product) => (
          <Item
            key={product.id}
            id={product.id}
            image={product.image}
            name={product.name}
            old_price={product.old_price}
            new_price={product.new_price}
          />
        ))}
      </div>
      <div className="shop-category-load-more">
        <button>Load More</button>
      </div>
    </div>
  )
}

export default ShopCategory;