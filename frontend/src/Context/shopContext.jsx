import React, { createContext, useState } from 'react';
import all_products from '../Components/Assets/all_products';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};

  for (let i = 0; i < all_products.length; i++) {
    cart[all_products[i].id] = 0;
  }

  return cart;
};

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());

  const addToCart = (itemId) => {
    setCartItems((prev) => {
      return { ...prev, [itemId]: prev[itemId] + 1 };
    });

    console.log('cartItems:', cartItems);
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      return { ...prev, [itemId]: prev[itemId] - 1 };
    });

    console.log('cartItems:', cartItems);
  }

  const clearCart = () => {
    setCartItems(getDefaultCart());

    console.log('cartItems:', cartItems);
  }

  const contextValues = { all_products, cartItems, addToCart, removeFromCart, clearCart };

  return (
    <ShopContext.Provider value={contextValues}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;