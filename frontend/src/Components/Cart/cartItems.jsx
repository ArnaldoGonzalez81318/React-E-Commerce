import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineRemoveShoppingCart } from 'react-icons/md';
import { ShopContext } from '../../Context/shopContext';
import './cartItems.css';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const CartItems = () => {
  const {
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    removeProductFromCart,
    getTotalCartAmount,
  } = useContext(ShopContext);

  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  const cartProducts = useMemo(() => {
    if (!allProducts?.length) return [];
    return allProducts.filter(product => (cartItems[product.id] || 0) > 0);
  }, [allProducts, cartItems]);

  const handlePromoSubmit = event => {
    event.preventDefault();
    if (!promoCode.trim()) {
      setPromoMessage('Enter a promo code to apply savings.');
      return;
    }
    setPromoMessage('Promo applied! Savings will appear at checkout.');
    setPromoCode('');
  };

  const subtotal = Number(getTotalCartAmount());

  return (
    <section className='cart section-shell'>
      <div className='cart-layout'>
        <div className='cart-list card'>
          <div className='cart-list-head'>
            <div>Product</div>
            <div>Details</div>
            <div>Qty</div>
            <div>Price</div>
            <div>Total</div>
          </div>
          {cartProducts.length ? (
            cartProducts.map(product => {
              const quantity = cartItems[product.id] || 0;
              const lineTotal = quantity * (product.new_price || 0);
              return (
                <article key={product.id} className='cart-row'>
                  <img src={product.image} alt={product.name} className='cart-row-media' />
                  <div className='cart-row-info'>
                    <h3>{product.name}</h3>
                    <p>Ships in 2–4 days · Free returns</p>
                    <button type='button' onClick={() => removeProductFromCart(product.id)} className='remove-link'>
                      <MdOutlineRemoveShoppingCart aria-hidden /> Remove
                    </button>
                  </div>
                  <div className='cart-row-qty'>
                    <button type='button' onClick={() => removeFromCart(product.id)} aria-label='Decrease quantity'>−</button>
                    <span>{quantity}</span>
                    <button type='button' onClick={() => addToCart(product.id)} aria-label='Increase quantity'>+</button>
                  </div>
                  <div className='cart-row-price'>{currency.format(product.new_price || 0)}</div>
                  <div className='cart-row-total'>{currency.format(lineTotal)}</div>
                </article>
              );
            })
          ) : (
            <div className='cart-empty'>
              <p>Your bag is empty.</p>
              <Link to='/' className='btn-primary'>
                Shop new arrivals
              </Link>
            </div>
          )}
        </div>

        <aside className='cart-summary card'>
          <h2>Order Summary</h2>
          <div className='summary-row'>
            <span>Subtotal</span>
            <span>{currency.format(subtotal)}</span>
          </div>
          <div className='summary-row'>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className='summary-row total'>
            <span>Total</span>
            <span>{currency.format(subtotal)}</span>
          </div>

          <form className='promo-form' onSubmit={handlePromoSubmit}>
            <label htmlFor='promo' className='sr-only'>Promo code</label>
            <input
              id='promo'
              type='text'
              placeholder='Have a promo code?'
              value={promoCode}
              onChange={event => setPromoCode(event.target.value)}
            />
            <button type='submit' className='btn-secondary'>Apply</button>
          </form>
          {promoMessage && <p className='promo-message'>{promoMessage}</p>}

          <button className='btn-primary checkout-btn' disabled={!cartProducts.length}>
            Proceed to checkout
          </button>
          <Link to='/' className='btn-secondary continue-btn'>
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default CartItems;