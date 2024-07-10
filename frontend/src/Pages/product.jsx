import React, { useContext } from 'react';
import { ShopContext } from '../Context/shopContext';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Components/Breadcrumbs/breadcrumbs';
import ProductDisplay from '../Components/ProductDisplay/productDisplay';
import DescriptionBox from '../Components/DescriptionBox/descriptionBox';
import RelatedProducts from '../Components/RelatedProducts/relatedProducts';

import './CSS/product.css';

const Product = () => {
  const { allProducts } = useContext(ShopContext);
  const { id } = useParams();

  // Ensure allProducts is defined and has elements before calling find
  const product = allProducts?.find((e) => e.id === Number(id));

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className='product'>
      <Breadcrumbs product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts />
    </div>
  );
};

export default Product;