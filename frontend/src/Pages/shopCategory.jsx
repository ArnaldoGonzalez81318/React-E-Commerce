import React, { useContext, useMemo, useState } from 'react';
import { ShopContext } from '../Context/shopContext';
import Item from '../Components/Item/item';

import './CSS/shopCategory.css';

const heroCopy = {
  men: {
    eyebrow: 'Menswear 2025',
    title: 'Tailored fits for every chapter',
    body: 'Layered textures, architectural tailoring, and relaxed silhouettes built for the modern wardrobe.'
  },
  women: {
    eyebrow: 'Women • New Season',
    title: 'Fluid shapes, elevated essentials',
    body: 'Statement dresses, soft suiting, and off-duty sets curated for intentional dressing.'
  },
  kids: {
    eyebrow: 'Mini capsule',
    title: 'Playproof looks with personality',
    body: 'Color-forward staples and easy-care fabrics sized for adventures big and small.'
  },
  default: {
    eyebrow: 'Seasonal edit',
    title: 'Looks with lasting impact',
    body: 'Explore pieces curated to move seamlessly from day to night.'
  }
};

const priceFilters = [
  { id: 'all', label: 'All', helper: 'Every style', predicate: () => true },
  { id: 'under-75', label: 'Under $75', helper: 'Everyday staples', predicate: (product) => product.new_price <= 75 },
  { id: '75-150', label: '$75 - $150', helper: 'Most-loved', predicate: (product) => product.new_price > 75 && product.new_price <= 150 },
  { id: 'over-150', label: 'Splurge', helper: 'Limited drops', predicate: (product) => product.new_price > 150 }
];

const sortOptions = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest arrivals' }
];

const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);

const ShopCategory = ({ category = '', banner }) => {
  const { allProducts = [] } = useContext(ShopContext);
  const [sort, setSort] = useState('featured');
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(12);

  const normalizedCategory = category.toLowerCase();
  const copy = heroCopy[normalizedCategory] || heroCopy.default;
  const isLoading = !allProducts.length;

  const baseProducts = useMemo(
    () => allProducts.filter((product) => product.category === normalizedCategory),
    [allProducts, normalizedCategory]
  );

  const filteredProducts = useMemo(() => {
    const predicate = priceFilters.find((filter) => filter.id === activeFilter)?.predicate || (() => true);
    return baseProducts.filter(predicate);
  }, [activeFilter, baseProducts]);

  const sortedProducts = useMemo(() => {
    const nextProducts = [...filteredProducts];
    switch (sort) {
      case 'price-low':
        return nextProducts.sort((a, b) => a.new_price - b.new_price);
      case 'price-high':
        return nextProducts.sort((a, b) => b.new_price - a.new_price);
      case 'newest':
        return nextProducts.sort((a, b) => b.id - a.id);
      default:
        return nextProducts;
    }
  }, [filteredProducts, sort]);

  const productsToRender = sortedProducts.slice(0, visibleCount);
  const canLoadMore = visibleCount < sortedProducts.length;

  const avgPrice = filteredProducts.length
    ? filteredProducts.reduce((sum, product) => sum + product.new_price, 0) / filteredProducts.length
    : 0;

  const handleLoadMore = () => setVisibleCount((prev) => prev + 8);

  return (
    <section className="shop-category section-shell" aria-live="polite">
      <div className="shop-category-hero">
        <div className="shop-category-hero-copy">
          <p className="shop-category-eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="shop-category-description">{copy.body}</p>
          <div className="shop-category-actions">
            <button className="btn-primary">View curated edit</button>
            <button className="btn-secondary" type="button">Build a look</button>
          </div>
        </div>
        <div className="shop-category-hero-visual">
          <img className="shop-category-banner" src={banner} alt={`${category} featured banner`} />
          <div className="shop-category-stats">
            <div>
              <p className="stat-label">Styles ready</p>
              <p className="stat-value">{filteredProducts.length}</p>
            </div>
            <div>
              <p className="stat-label">Avg investment</p>
              <p className="stat-value">{formatPrice(avgPrice)}</p>
            </div>
            <div>
              <p className="stat-label">In stock</p>
              <p className="stat-value">{allProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="shop-category-panel">
        <div>
          <p className="shop-category-eyebrow">Showing {productsToRender.length} of {sortedProducts.length} looks</p>
          <h2 className="shop-category-panel-title">{copy.title}</h2>
        </div>
        <div className="shop-category-controls" role="toolbar" aria-label="Category filters">
          <div className="shop-category-filter-pills">
            {priceFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={activeFilter === filter.id ? 'filter-pill is-active' : 'filter-pill'}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setVisibleCount(12);
                }}
              >
                <span>{filter.label}</span>
                <small>{filter.helper}</small>
              </button>
            ))}
          </div>
          <label className="shop-category-sort" htmlFor="shop-category-sort-select">
            Sort by
            <select
              id="shop-category-sort-select"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="shop-category-skeletons" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton-card">
              <span className="skeleton" />
              <span className="skeleton" />
              <span className="skeleton" />
            </div>
          ))}
        </div>
      ) : sortedProducts.length ? (
        <>
          <div className="shop-category-grid">
            {productsToRender.map((product) => (
              <Item
                key={product.id}
                id={product.id}
                image={product.image}
                name={product.name}
                old_price={product.old_price}
                new_price={product.new_price}
              />
            ))}
          </div>
          {canLoadMore && (
            <button type="button" className="btn-secondary load-more" onClick={handleLoadMore}>
              Load more looks
            </button>
          )}
        </>
      ) : (
        <div className="shop-category-empty">
          <p>No styles match this filter just yet.</p>
          <button type="button" className="btn-primary" onClick={() => setActiveFilter('all')}>
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
};

export default ShopCategory;