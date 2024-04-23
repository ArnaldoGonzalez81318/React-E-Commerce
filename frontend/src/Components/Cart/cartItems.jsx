import React, { useContext } from 'react';
import { ShopContext } from '../../Context/shopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

import './cartItems.css'

const CartItems = () => {
  const { all_products, cartItems, addToCart, removeFromCart } = useContext(ShopContext);

  return (
    <div className="cart-items">
      <h2>Cart</h2>
      <div className='cart-items-header'>
        <h3>Product</h3>
        <h3>Title</h3>
        <h3>Quantity</h3>
        <h3>Price</h3>
        <h3>Total</h3>
        <h3>Remove</h3>
      </div>
      <hr />
      <div className='cart-items-container'>
        <div className='cart-items-list'>
          {all_products.map((product) => {
            if (cartItems[product.id] > 0) {
              return (
                <div className='cart-item-wrapper' key={product.id}>
                  <div className='cart-item'>
                    <img src={product.image} alt={product.name} className='cart-item-image' />
                    <p className='cart-item-title'>{product.name}</p>
                    <div className='quantity'>
                      <button onClick={() => removeFromCart(product.id)}>-</button>
                      <p>{cartItems[product.id]}</p>
                      <button onClick={() => addToCart(product.id)}>+</button>
                    </div>
                    <p>${product.new_price}</p>
                    <p>${(cartItems[product.id] * product.new_price).toFixed(2)}</p>
                    <div className='remove-item' onClick={() => removeFromCart(product.id)}>
                      <img src={remove_icon} className='remove-icon' alt='remove' />
                    </div>
                  </div>
                  <hr />
                </div>
              );
            } else {
              return null;
            }
          })}

          <div className='cart-items-total'>
            <div className='cart-items-total-wrapper'>
              <h2>Total</h2>
              <h2>${all_products.reduce((acc, product) => {
                return acc + cartItems[product.id] * product.new_price;
              }, 0).toFixed(2)}</h2>
              <h2>Subtotal</h2>
              <h2>${all_products.reduce((acc, product) => {
                return acc + cartItems[product.id] * product.new_price;
              }, 0).toFixed(2)}</h2>
            </div>
            <div className='cart-items-promo'>
              <p><span>Have a promo code?</span></p>
              <input type='text' placeholder='Promo Code' />
              <button>Apply</button>
            </div>
            <div className='checkout-button'>
              <button>Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItems