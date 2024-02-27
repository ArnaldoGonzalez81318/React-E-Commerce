import React, { useContext } from 'react';
import { ShopContext } from '../Context/shopContext';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Components/Breadcrumbs/breadcrumbs';
import ProductDisplay from '../Components/ProductDisplay/productDisplay';
import DescriptionBox from '../Components/DescriptionBox/descriptionBox';

import './CSS/product.css';
import RelatedProducts from '../Components/RelatedProducts/relatedProducts';

const Product = () => {
  const { products } = useContext(ShopContext);
  const { id } = useParams();
  const product = products.find(product => product.id === Number(id));

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