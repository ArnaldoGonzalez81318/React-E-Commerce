import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});

  // Function to get the default cart
  const getDefaultCart = (products) => {
    const defaultCart = {};
    products.forEach((product) => {
      defaultCart[product.id] = 0;
    });
    return defaultCart;
  };

  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/products');
        const data = await response.json();
        if (data && data.products) {
          setAllProducts(data.products);
          setCartItems(getDefaultCart(data.products));
        } else {
          console.error('Error: products not found in the response');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch cart items if the user is authenticated
  useEffect(() => {
    const fetchCart = async () => {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
          const response = await fetch('http://localhost:4000/cart', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setCartItems(data.cartData);
        } catch (error) {
          console.error('Error fetching cart data:', error);
        }
      } else {
        console.log('No user logged in');
      }
    };
    fetchCart();
  }, []);

  // Add item to the cart
  const addToCart = async (itemId, quantity = 1) => {
    const updatedCartItems = {
      ...cartItems,
      [itemId]: (cartItems[itemId] || 0) + quantity,
    };
    setCartItems(updatedCartItems);

    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const response = await fetch('http://localhost:4000/add-to-cart', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            userId: localStorage.getItem('userId'),
            productId: itemId,
            quantity: quantity,
          }),
        });
        const data = await response.json();
        console.log('Add to cart response:', data);
        if (data.error) {
          console.error('Error adding to cart:', data.error);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }

    console.log('Updated cartItems:', updatedCartItems);
  };

  // Remove item from the cart
  const removeFromCart = async (itemId) => {
    const updatedCartItems = {
      ...cartItems,
      [itemId]: Math.max((cartItems[itemId] || 1) - 1, 0),
    };
    setCartItems(updatedCartItems);

    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const response = await fetch('http://localhost:4000/remove-from-cart', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            userId: localStorage.getItem('userId'),
            productId: itemId,
          }),
        });
        const data = await response.json();
        console.log('Remove from cart response:', data);
        if (data.error) {
          console.error('Error removing from cart:', data.error);
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      console.log('No user logged in');
    }

    console.log('Updated cartItems:', updatedCartItems);
  };

  // Remove product completely from the cart
  const removeProductFromCart = async (itemId) => {
    const updatedCartItems = {
      ...cartItems,
      [itemId]: 0,
    };
    setCartItems(updatedCartItems);

    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const response = await fetch('http://localhost:4000/remove-product-from-cart', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            userId: localStorage.getItem('userId'),
            productId: itemId,
          }),
        });
        const data = await response.json();
        console.log('Remove product from cart response:', data);
        if (data.error) {
          console.error('Error removing product from cart:', data.error);
        }
      } catch (error) {
        console.error('Error removing product from cart:', error);
      }
    } else {
      console.log('No user logged in');
    }

    console.log('Updated cartItems:', updatedCartItems);
  };

  // Clear the cart
  const clearCart = () => {
    const defaultCart = getDefaultCart(allProducts);
    setCartItems(defaultCart);
    console.log('Cleared cartItems:', defaultCart);
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    const total = Object.entries(cartItems).reduce((acc, [itemId, quantity]) => {
      const product = allProducts.find((product) => product.id === Number(itemId));
      return acc + quantity * (product?.new_price || 0);
    }, 0);
    return total.toFixed(2);
  };

  // Get total cart items
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((acc, quantity) => acc + quantity, 0);
  };

  const contextValues = {
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    removeProductFromCart,
    clearCart,
    getTotalCartAmount,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValues}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;