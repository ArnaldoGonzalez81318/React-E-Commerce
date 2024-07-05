import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [all_products, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  function getDefaultCart() {
    let defaultCart = {};
    all_products.forEach((product) => {
      defaultCart[product.id] = 0;
    });
    return defaultCart;
  }

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

    if (localStorage.getItem('authToken')) {
      fetch('http://localhost:4000/cart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId')
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log('Fetched cart data:', data);
          setCartItems(data.cart);
        })
        .catch(err => {
          console.log('Error:', err);
        });
    } else {
      console.log('No user logged in');
    }
  }, []);

  const addToCart = (itemId, quantity = 1) => {
    setCartItems((prev) => {
      return { ...prev, [itemId]: (prev[itemId] || 0) + quantity };
    });

    if (localStorage.getItem('authToken')) {
      fetch('http://localhost:4000/add-to-cart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          productId: itemId,
          quantity: quantity
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log('Add to cart response:', data);
        })
        .catch(err => {
          console.log('Error:', err);
        });
    }

    console.log('Updated cartItems:', cartItems);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      return { ...prev, [itemId]: prev[itemId] - 1 };
    });

    if (localStorage.getItem('authToken')) {
      fetch('http://localhost:4000/remove-from-cart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          productId: itemId
        })
      })
        .then(res => res.json())
        .then(data => {
          console.log('Remove from cart response:', data);
        })
        .catch(err => {
          console.log('Error:', err);
        });
    } else {
      console.log('No user logged in');
    }

    console.log('Updated cartItems:', cartItems);
  };

  const clearCart = () => {
    setCartItems(getDefaultCart());

    console.log('Cleared cartItems:', cartItems);
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let product = all_products.find((product) => product.id === Number(item));
        total += cartItems[item] * (product?.new_price || 0);
      }
      console.log('Current total:', total);
    }
    return total.toFixed(2);
  };

  const getTotalCartItems = () => {
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        total += cartItems[item];
      }
    }
    return total;
  };

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