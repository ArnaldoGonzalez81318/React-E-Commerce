import React, { useContext } from 'react';
import { ShopContext } from '../Context/shopContext';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Components/Breadcrumbs/breadcrumbs';
import ProductDisplay from '../Components/ProductDisplay/productDisplay';
import DescriptionBox from '../Components/DescriptionBox/descriptionBox';
import RelatedProducts from '../Components/RelatedProducts/relatedProducts';

import './CSS/product.css';

const Product = () => {
  const { all_products } = useContext(ShopContext);
  const { id } = useParams();
  const product = all_products.find((e) => e.id === Number(id));
  // const product = all_products.find((product) => product.id === Number(id));

  return (
    <div className='product'>
      <Breadcrumbs product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts />
    </div>
  )
}

export default Product