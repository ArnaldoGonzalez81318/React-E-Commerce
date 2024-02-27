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
  // const products = all_products;

  const addToCart = (id) => {
    setCartItems((prev) => {
      return { ...prev, [id]: prev[id] + 1 };
    });
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      return { ...prev, [id]: prev[id] - 1 };
    });
  }

  const products = all_products.map((product) => {
    return {
      ...product,
      inCart: cartItems[product.id],
      addToCart: () => addToCart(product.id),
      removeFromCart: () => removeFromCart(product.id)
    };
  });

  console.log('products', products);

  return (
    <ShopContext.Provider value={{ products }}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;