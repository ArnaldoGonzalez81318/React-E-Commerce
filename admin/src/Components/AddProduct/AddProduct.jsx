import { useState } from 'react'
import uploadArea from '../../assets/upload_area.svg'
import './AddProduct.css'

const AddProduct = () => {
  const [image, setImage] = useState(null)
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: '',
    old_price: '',
    new_price: ''
  })

  const imageHandler = (e) => {
    setImage(e.target.files[0])
  }

  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    })
  }

  const addProductHandler = async (e) => {
    console.log('Product Details:', productDetails)
    e.preventDefault()
  }

  return (
    <div className="add-product">
      <div className="add-product-wrapper">
        <h2 className="add-product-title">Add Product</h2>
        <form className="add-product-form">
          <div className="add-product-form-group">
            <label htmlFor="name" className="add-product-form-label">Product Name</label>
            <input
              type="text"
              id="name"
              className="add-product-form-input"
              name='name'
              placeholder="Product Name"
              onChange={changeHandler}
              value={productDetails.name}
            />
          </div>
          <div className="add-product-form-group-row">
            <div className="add-product-form-group">
              <label htmlFor="price" className="add-product-form-label">Price</label>
              <input
                type="text"
                id="price"
                className="add-product-form-input"
                name='old_price'
                placeholder='Price'
                onChange={changeHandler}
                value={productDetails.old_price}
              />
            </div>
            <div className="add-product-form-group">
              <label htmlFor="newPrice" className="add-product-form-label">Offer Price</label>
              <input
                type="text"
                id="newPrice"
                className="add-product-form-input"
                name='new_price'
                placeholder='Offer Price'
                onChange={changeHandler}
                value={productDetails.new_price}
              />
            </div>
          </div>
          <div className="add-product-form-group">
            <label htmlFor="category" className="add-product-form-label">Category</label>
            <select
              name="category"
              id="category"
              className="add-product-form-select"
              onChange={changeHandler}
              value={productDetails.category}
            >
              <option value="Select Category" defaultValue={true}>Select Category</option>
              <option value="womens">Womens</option>
              <option value="mens">Mens</option>
              <option value="kids">Kids</option>
            </select>
          </div>
          <div className="add-product-form-group">
            <label htmlFor="description" className="add-product-form-label">Description</label>
            <textarea
              id="description"
              className="add-product-form-textarea"
              name='description'
              placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
            ></textarea>
          </div>
          <div className="add-product-form-group">
            <label htmlFor="image" className="add-product-form-label-upload">
              <img
                src={image ? URL.createObjectURL(image) : uploadArea}
                alt="Upload Area"
                className="add-product-form-upload-thumbnail"
              />
            </label>
            <input
              type="file"
              id="image"
              className="add-product-form-file"
              name='image'
              accept="image/*"
              hidden
              onChange={imageHandler}
            />
          </div>
          <button
            type="submit"
            className="add-product-form-button"
            onClick={addProductHandler}>
            Add Product
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct