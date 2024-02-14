import React, { useContext } from 'react';
import { ShopContext } from '../Context/shopContext';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from '../Components/Item/item';

import './CSS/shopCategory.css'

const ShopCategory = (props) => {
  const { products } = useContext(ShopContext);
  // console.log('products:', products)

  return (
    <div className="shop-category">
      <img className='shop-category-banner' src={props.banner} alt="banner" />
      <h2>{props.category}</h2>
      <div className="shop-category-sort">
        <p className="shop-category-sort-count">
          <span>
            Showing <strong style={{ color: '#ff6e6c' }}>
              {products.filter((product) => product.category === props.category).length}
            </strong>
          </span>
          &nbsp;proudcts out of&nbsp;
          <strong style={{ color: '#ff6e6c' }}>{products.length}</strong>
        </p>
        <label htmlFor="sort">Sort by: <img src={dropdown_icon} alt="dropdown" /></label>
      </div>
      <div className="shop-category-products">
        {products.map((product) => {
          // console.log('product:', product)
          // This is a ternary operator that checks if the product's category matches the category of the page.
          // If it does, it returns the Item component with the product's details. If it doesn't, it returns null.
          return product.category === props.category ? (
            <Item
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              old_price={product.old_price}
              new_price={product.new_price}
            />
          ) : null;
        })}
      </div>
      <div className="shop-category-load-more">
        <button>Load More</button>
      </div>
    </div>
  )
}

export default ShopCategory