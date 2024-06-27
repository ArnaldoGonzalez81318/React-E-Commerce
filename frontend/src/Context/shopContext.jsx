import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};

  for (let i = 0; i < 300 + 1; i++) {
    cart[i] = 0;
  }

  return cart;
};

const ShopContextProvider = (props) => {
  const [all_products, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
    fetch('http://localhost:4000/products')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched data:', data);
        setAllProducts(data.products);
      })
      .catch(err => {
        console.log('Error:', err);
      });
  }, []);

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

  const getTotalCartAmount = () => {
    let total = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let product = all_products.find((product) => product.id === Number(item));
        total += cartItems[item] * product.new_price;
      }

      console.log('total:', total);
    }

    return total.toFixed(2);
  }

  const getTotalCartItems = () => {
    let total = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        total += cartItems[item];
      }
    }

    return total;
  }

  const contextValues = {
    all_products,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    getTotalCartItems
  };

  return (
    <ShopContext.Provider value={contextValues}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;