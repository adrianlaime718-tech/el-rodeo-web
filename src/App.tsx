import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Users from './pages/Users'
import Tables from './pages/Tables'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pedidos" element={<Orders />} />

            <Route element={<AdminRoute />}>
              <Route path="/productos" element={<Products />} />
              <Route path="/categorias" element={<Categories />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/mesas" element={<Tables />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
