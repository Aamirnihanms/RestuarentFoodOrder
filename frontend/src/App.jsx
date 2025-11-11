import React from 'react'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import AuthPages from './pages/Login'
import HomePage from './pages/Home'
import FoodDetailPage from './pages/Detail'
import CartPage from './pages/Cart'
import AdminPanel from './pages/admin/Admin'

function App() {

  return (
    <>
        <Routes>
          <Route path="/" element={<AuthPages />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/food/:id" element={<FoodDetailPage/>} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/admin" element={<AdminPanel/>} />
        </Routes>

    </>
  )
}

export default App
