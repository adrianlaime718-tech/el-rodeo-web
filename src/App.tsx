import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Orders from './pages/Orders'
import Login from './pages/Login'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/pedidos" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App