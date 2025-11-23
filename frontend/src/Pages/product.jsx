import React, { useContext, useMemo } from 'react';
import { ShopContext } from '../Context/shopContext';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../Components/Breadcrumbs/breadcrumbs';
import ProductDisplay from '../Components/ProductDisplay/productDisplay';
import DescriptionBox from '../Components/DescriptionBox/descriptionBox';
import RelatedProducts from '../Components/RelatedProducts/relatedProducts';

import './CSS/product.css';

const Product = () => {
  const { allProducts } = useContext(ShopContext);
  const { id } = useParams();

  const product = useMemo(() => {
    if (!allProducts?.length || !id) return null;
    const numericId = Number(id);
    return allProducts.find(item => {
      if (Number.isFinite(numericId) && item.id === numericId) return true;
      if (typeof item.id !== 'undefined' && String(item.id) === id) return true;
      if (item._id && item._id.toString() === id) return true;
      return false;
    }) || null;
  }, [allProducts, id]);

  if (!allProducts?.length) {
    return (
      <section className='product product-state'>
        <div className='product-loader card'>
          <span className='loader-dot' aria-hidden />
          <p>Loading product details…</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className='product product-state'>
        <div className='product-empty card'>
          <p>We couldn’t find that product.</p>
          <p className='product-empty-sub'>It may have been removed or is no longer available.</p>
          <Link to='/' className='btn-secondary'>
            Back to collections
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className='product'>
      <Breadcrumbs product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox product={product} />
      <RelatedProducts category={product.category} excludeId={product.id} />
    </div>
  );
};

export default Product;