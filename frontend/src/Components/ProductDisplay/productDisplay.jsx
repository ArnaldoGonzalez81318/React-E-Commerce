import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ShopContext } from '../../Context/shopContext';
import './productDisplay.css';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const defaultColors = ['#0f172a', '#f97316', '#6366f1', '#10b981'];
const fallbackSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
const footwearFallbackSizes = Array.from({ length: 30 }, (_, index) => {
  const value = 3.5 + index * 0.5;
  return Number.isInteger(value) ? value.toFixed(0) : value.toString();
});

const perks = [
  { title: 'Express shipping', body: 'Free 2-day delivery for orders over $150' },
  { title: 'Hassle-free returns', body: '30-day returns with prepaid labels' },
  { title: 'Concierge support', body: 'Real humans via chat, email, or phone' },
];

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const gallery = useMemo(() => {
    const sources = [...(product?.images || []), product?.image].filter(Boolean);
    const unique = Array.from(new Set(sources));
    return unique.slice(0, 4);
  }, [product]);

  const colorOptions = useMemo(() => {
    if (product?.variants?.colors?.length) return product.variants.colors;
    if (product?.swatches?.length) return product.swatches;
    return defaultColors;
  }, [product]);

  const sizeOptions = useMemo(() => {
    if (product?.variants?.sizeType === 'none') return [];
    if (product?.variants?.sizes?.length) return product.variants.sizes;
    if (product?.sizes?.length) return product.sizes;
    if (product?.productType === 'footwear') return footwearFallbackSizes;
    return fallbackSizes;
  }, [product]);

  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]);
  const [wishlisted, setWishlisted] = useState(false);
  const [shareState, setShareState] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    setActiveImage(gallery[0]);
  }, [gallery]);

  useEffect(() => {
    setSelectedColor(colorOptions[0]);
  }, [colorOptions]);

  useEffect(() => {
    setSelectedSize(sizeOptions[0]);
  }, [sizeOptions]);

  useEffect(() => {
    if (shareState.status === 'idle') return;
    const timeout = setTimeout(() => setShareState({ status: 'idle', message: '' }), 2500);
    return () => clearTimeout(timeout);
  }, [shareState]);

  const increaseQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decreaseQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    if (!product?.id) return;
    addToCart(product.id, quantity);
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const payload = {
      title: product?.name || 'Product',
      text: 'Check out this drop from React E-Commerce',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        setShareState({ status: 'success', message: 'Shared successfully' });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(payload.url);
        setShareState({ status: 'success', message: 'Link copied to clipboard' });
      } else {
        throw new Error('Sharing is not supported');
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      setShareState({ status: 'error', message: 'Unable to share right now' });
    }
  };

  const specs = [
    { label: 'SKU', value: product?.sku || `SKU-${product?.id ?? 'N/A'}` },
    { label: 'Category', value: product?.category },
    { label: 'Type', value: product?.productType },
    { label: 'Size run', value: product?.variants?.sizeType === 'numeric' ? 'Half sizes 3.5 - 18' : product?.variants?.sizeType === 'alpha' ? 'XS - 2XL' : null },
    { label: 'Material', value: product?.material || 'Premium knit + leather mix' },
    { label: 'Care', value: product?.care || 'Machine wash cold, lay flat to dry' },
  ].filter(item => item.value);

  const highlights = product?.highlights || [
    'Cloud-like cushioning for all-day wear',
    'Breathable mesh keeps you cool and agile',
    'Responsive midsole absorbs every impact',
    'Crafted with recycled materials to reduce impact',
  ];

  const descriptionText = product?.description ||
    'Engineered for everyday movement with breathable knits, sculpted tailoring, and adaptive cushioning.';
  const descriptionParagraphs = descriptionText.split(/\n+/).filter(Boolean);

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
          <p className='product-subtitle'>{descriptionParagraphs[0]}</p>
          <div className='product-price-row'>
            {priceNew && <span className='product-price-new'>{priceNew}</span>}
            {priceOld && <span className='product-price-old'>{priceOld}</span>}
            <span className='product-stock'>{product?.available ? 'In stock' : 'Ships soon'}</span>
          </div>
        </div>

        <div className='product-utilities'>
          <button type='button' className={`utility-chip ${wishlisted ? 'is-active' : ''}`} onClick={() => setWishlisted(prev => !prev)}>
            {wishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
          </button>
          <button type='button' className='utility-chip' onClick={handleShare}>
            Share
          </button>
          {shareState.message && (
            <span className={`utility-feedback ${shareState.status}`}>{shareState.message}</span>
          )}
        </div>

        <div className='product-options'>
          <div>
            <p className='label'>Color</p>
            <div className='swatches'>
              {colorOptions.map(color => (
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

          {sizeOptions.length > 0 && (
            <div>
              <p className='label'>Size</p>
              <div className='sizes'>
                {sizeOptions.map(size => (
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
          )}

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

        <div className='product-description'>
          {descriptionParagraphs.slice(1).map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>

        <div className='product-specs'>
          {specs.map(spec => (
            <div key={spec.label}>
              <span>{spec.label}</span>
              <p>{spec.value}</p>
            </div>
          ))}
        </div>

        <div className='product-meta'>
          <ul>
            {highlights.map(highlight => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>

        <div className='product-perks'>
          {perks.map(perk => (
            <article key={perk.title}>
              <p>{perk.title}</p>
              <span>{perk.body}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDisplay;