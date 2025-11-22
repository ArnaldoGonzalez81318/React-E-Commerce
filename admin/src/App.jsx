import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import AdminLayout from './Pages/Admin/Admin'
import AddProduct from './Components/AddProduct/AddProduct'
import ProductList from './Components/ProductList/ProductList'
import EditProduct from './Components/EditProduct/EditProduct'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="add-product" replace />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="product-list" element={<ProductList />} />
          <Route path="edit-product/:productId" element={<EditProduct />} />
        </Route>
        <Route path="*" element={<Navigate to="/add-product" replace />} />
      </Routes>
    </div>
  )
}

export default App