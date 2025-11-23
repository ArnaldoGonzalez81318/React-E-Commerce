import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineRemoveShoppingCart } from 'react-icons/md';
import { FaApplePay, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { SiShopify } from 'react-icons/si';
import { ShopContext } from '../../Context/shopContext';
import './cartItems.css';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const shippingOptions = [
  { id: 'standard', label: 'Standard · Free', eta: 'Arrives in 3-5 days', cost: 0 },
  { id: 'express', label: 'Express · $18', eta: 'Arrives in 1-2 days', cost: 18 },
];

const paymentMethods = [
  { id: 'shop-pay', label: 'Shop Pay', icon: <SiShopify aria-hidden /> },
  { id: 'apple-pay', label: 'Apple Pay', icon: <FaApplePay aria-hidden /> },
  { id: 'visa', label: 'Visa', icon: <FaCcVisa aria-hidden /> },
  { id: 'mastercard', label: 'Mastercard', icon: <FaCcMastercard aria-hidden /> },
];

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
  const [shippingMethod, setShippingMethod] = useState(shippingOptions[0].id);
  const [orderNotes, setOrderNotes] = useState('');

  const cartProducts = useMemo(() => {
    if (!allProducts?.length) return [];
    return allProducts.filter(product => (cartItems[product.id] || 0) > 0);
  }, [allProducts, cartItems]);

  const recommendedProducts = useMemo(() => {
    if (!allProducts?.length) return [];
    const curated = allProducts.filter(product => !cartItems[product.id]).slice(0, 4);
    return curated;
  }, [allProducts, cartItems]);

  const selectedShipping = shippingOptions.find(option => option.id === shippingMethod) || shippingOptions[0];

  const handlePromoSubmit = event => {
    event.preventDefault();
    if (!promoCode.trim()) {
      setPromoMessage('Enter a promo code to apply savings.');
      return;
    }
    setPromoMessage(`Promo “${promoCode.toUpperCase()}” applied! Savings will appear at checkout.`);
    setPromoCode('');
  };

  const subtotal = Number(getTotalCartAmount());
  const orderTotal = subtotal + selectedShipping.cost;
  const progressTarget = 150;
  const progress = Math.min(subtotal / progressTarget, 1);
  const progressMessage =
    subtotal >= progressTarget
      ? 'You unlocked complimentary express shipping and easy returns.'
      : `Add ${currency.format(progressTarget - subtotal)} more for complimentary express shipping.`;

  const handleCheckout = () => {
    if (!cartProducts.length) {
      setPromoMessage('Add items to your bag to proceed to checkout.');
      return;
    }
    // In a real flow we would route to checkout.
    setPromoMessage('Redirecting you to secure checkout…');
  };

  return (
    <section className='cart section-shell'>
      <div className='cart-layout'>
        <div className='cart-list card'>
          <div className='cart-banner'>
            <p>{progressMessage}</p>
            <div className='progress-track' role='progressbar' aria-valuenow={progress * 100} aria-valuemin='0' aria-valuemax='100'>
              <span style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
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
              <div>
                <p>Your bag is empty.</p>
                <p className='cart-empty-sub'>Save favorites, track orders, and unlock exclusive perks when you checkout.</p>
              </div>
              <Link to='/' className='btn-primary'>
                Shop new arrivals
              </Link>
            </div>
          )}
        </div>

        <aside className='cart-summary card'>
          <h2>Order Summary</h2>
          <div className='shipping-options' role='radiogroup' aria-label='Shipping method'>
            {shippingOptions.map(option => (
              <label key={option.id} className={shippingMethod === option.id ? 'shipping-option is-active' : 'shipping-option'}>
                <input
                  type='radio'
                  name='shipping'
                  value={option.id}
                  checked={shippingMethod === option.id}
                  onChange={() => setShippingMethod(option.id)}
                />
                <div>
                  <p>{option.label}</p>
                  <small>{option.eta}</small>
                </div>
              </label>
            ))}
          </div>

          <div className='summary-row'>
            <span>Subtotal</span>
            <span>{currency.format(subtotal)}</span>
          </div>
          <div className='summary-row'>
            <span>Shipping</span>
            <span>{selectedShipping.cost ? currency.format(selectedShipping.cost) : 'Free'}</span>
          </div>
          <div className='summary-row total'>
            <span>Total</span>
            <span>{currency.format(orderTotal)}</span>
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

          <label className='notes-field'>
            <span>Add order note (optional)</span>
            <textarea
              rows='3'
              value={orderNotes}
              onChange={event => setOrderNotes(event.target.value)}
              placeholder='Add delivery instructions or gifting notes.'
            />
          </label>

          <button type='button' className='btn-primary checkout-btn' onClick={handleCheckout} disabled={!cartProducts.length}>
            Proceed to checkout
          </button>
          <Link to='/' className='btn-secondary continue-btn'>
            Continue shopping
          </Link>
          <div className='checkout-security'>
            <p>Secure checkout</p>
            <div className='checkout-badges' aria-label='Accepted payment methods'>
              {paymentMethods.map(method => (
                <span key={method.id} className='checkout-badge'>
                  {method.icon}
                  <span>{method.label}</span>
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {recommendedProducts.length > 0 && (
        <section className='cart-suggestions card'>
          <header>
            <p className='cart-eyebrow'>You may also like</p>
            <h3>Complete the look</h3>
          </header>
          <div className='suggestion-grid'>
            {recommendedProducts.map(product => (
              <article key={product.id} className='suggestion-card'>
                <img src={product.image} alt={product.name} />
                <div>
                  <p>{product.name}</p>
                  <span>{currency.format(product.new_price || 0)}</span>
                </div>
                <button type='button' className='btn-secondary' onClick={() => addToCart(product.id)}>
                  Add to bag
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
};

export default CartItems;