import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ShopContext } from '../../Context/shopContext';
import './productDisplay.css';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const defaultColors = ['#0f172a', '#f97316', '#6366f1', '#10b981'];
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const gallery = useMemo(() => {
    const sources = [...(product?.images || []), product?.image].filter(Boolean);
    const unique = Array.from(new Set(sources));
    return unique.slice(0, 4);
  }, [product]);

  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(defaultColors[0]);
  const [selectedSize, setSelectedSize] = useState('M');

  useEffect(() => {
    setActiveImage(gallery[0]);
  }, [gallery]);

  const increaseQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decreaseQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    if (!product?.id) return;
    addToCart(product.id, quantity);
  };

  const priceOld = product?.old_price ? priceFormatter.format(product.old_price) : null;
  const priceNew = product?.new_price ? priceFormatter.format(product.new_price) : null;

  return (
    <section className='product-display'>
      <div className='product-gallery'>
        <div className='product-thumbs'>
          {gallery.length > 0 ? (
            gallery.map((img, idx) => (
              <button
                key={img || idx}
                type='button'
                className={`thumb ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
                aria-label={`View image ${idx + 1}`}
              >
                <img src={img} alt={`${product?.name} ${idx + 1}`} />
              </button>
            ))
          ) : (
            <div className='thumb thumb-placeholder'>
              Coming soon
            </div>
          )}
        </div>
        <div className='product-hero'>
          {activeImage ? (
            <img src={activeImage} alt={product?.name} />
          ) : (
            <p className='hero-placeholder'>Visual coming soon</p>
          )}
        </div>
      </div>

      <div className='product-info card'>
        <div className='product-header'>
          <p className='pill'>Featured</p>
          <h1>{product?.name}</h1>
          <p className='product-subtitle'>Engineered for everyday movement with breathable knits and sculpted tailoring.</p>
          <div className='product-price-row'>
            {priceNew && <span className='product-price-new'>{priceNew}</span>}
            {priceOld && <span className='product-price-old'>{priceOld}</span>}
            <span className='product-stock'>{product?.available ? 'In stock' : 'Ships soon'}</span>
          </div>
        </div>

        <div className='product-options'>
          <div>
            <p className='label'>Color</p>
            <div className='swatches'>
              {(product?.swatches || defaultColors).map(color => (
                <button
                  key={color}
                  type='button'
                  className={`swatch ${selectedColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className='label'>Size</p>
            <div className='sizes'>
              {(product?.sizes || availableSizes).map(size => (
                <button
                  key={size}
                  type='button'
                  className={`size-chip ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className='label'>Quantity</p>
            <div className='quantity-control' role='group' aria-label='Select quantity'>
              <button type='button' onClick={decreaseQuantity} aria-label='Decrease quantity'>
                −
              </button>
              <input type='text' value={quantity} onChange={event => setQuantity(Math.max(1, Number(event.target.value) || 1))} />
              <button type='button' onClick={increaseQuantity} aria-label='Increase quantity'>
                +
              </button>
            </div>
          </div>
        </div>

        <div className='product-actions'>
          <button className='btn-primary' onClick={handleAddToCart} disabled={!product?.id}>
            Add to cart
          </button>
          <button className='btn-secondary'>Buy now</button>
        </div>

        <ul className='product-meta'>
          <li>Free express shipping over $150</li>
          <li>Free 30-day returns</li>
          <li>Carbon-neutral packaging</li>
        </ul>
      </div>
    </section>
  );
};

export default ProductDisplay;