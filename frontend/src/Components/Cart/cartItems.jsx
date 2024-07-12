import React, { useContext } from 'react';
import { ShopContext } from '../../Context/shopContext';
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import './cartItems.css';

const CartItems = () => {
  const {
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    removeProductFromCart,
    getTotalCartAmount
  } = useContext(ShopContext);

  return (
    <div className="cart-items">
      <div className="cart-items-header">
        <h2>Shopping Cart</h2>
        <div className='cart-items-header-wrapper'>
          <h3>Product</h3>
          <h3>Title</h3>
          <h3>Quantity</h3>
          <h3>Price</h3>
          <h3>Total</h3>
          <h3>Remove</h3>
        </div>
        <div className='cart-items-list'>
          {allProducts && allProducts.length > 0 ? (
            allProducts.map((product) => {
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
                      <div className='remove-item' onClick={() => removeProductFromCart(product.id)}>
                        <MdOutlineRemoveShoppingCart className='remove-icon' />
                      </div>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })
          ) : (
            <p>No items in cart</p>
          )}
        </div>
      </div>

      <div className='cart-items-total'>
        <div className='cart-items-total-wrapper'>
          <div className='cart-items-total-subtotal'>
            <h3>Subtotal</h3>
            <p>${getTotalCartAmount()}</p>
          </div>
          <div className='cart-items-total-shipping'>
            <h3>Shipping</h3>
            <p>Free</p>
          </div>
          <div className='cart-items-total-total'>
            <h3>Total</h3>
            <p>${getTotalCartAmount()}</p>
          </div>
        </div>
        <div className='cart-items-promo'>
          <input type='text' placeholder='Promo Code' />
          <button>Apply</button>
        </div>
        <div className='checkout-button'>
          <button>Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;