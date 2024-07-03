import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './breadcrumbs.css';

const Breadcrumbs = (props) => {
  const { product } = props;

  console.log('Props in breadcrumbs:', props);
  console.log('Product in breadcrumbs:', product);

  if (!product) {
    return <div className="breadcrumbs">No product data available</div>;
  }

  return (
    <div className='breadcrumbs'>
      <div className="breadcrumbs-container">
        <Link to='/'>Home</Link>
        <Link to='/shop'>Shop</Link>
        <Link to={`/category/${product.category}`}>{product.category}</Link>
        <p>{product.name}</p>
      </div>
    </div>
  );
}

Breadcrumbs.propTypes = {
  product: PropTypes.shape({
    category: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default Breadcrumbs;