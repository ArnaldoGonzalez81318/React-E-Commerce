import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './breadcrumbs.css';

const Breadcrumbs = ({ product }) => {
  const crumbs = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    product?.category && { label: product.category, to: `/category/${product.category}` },
    product?.name && { label: product.name },
  ].filter(Boolean);

  if (!crumbs.length) {
    return null;
  }

  return (
    <nav className='breadcrumbs' aria-label='Breadcrumb'>
      <ol className='breadcrumbs-list'>
        {crumbs.map((crumb, index) => (
          <li key={`${crumb.label}-${index}`} className='breadcrumbs-item'>
            {crumb.to && index !== crumbs.length - 1 ? (
              <Link to={crumb.to}>{crumb.label}</Link>
            ) : (
              <span aria-current='page'>{crumb.label || 'Product'}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  product: PropTypes.shape({
    category: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default Breadcrumbs;