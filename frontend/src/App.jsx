import React from 'react'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import AuthPages from './pages/Login'
import HomePage from './pages/Home'
import FoodDetailPage from './pages/Detail'
import CartPage from './pages/Cart'
import AdminPanel from './pages/admin/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import ProfilePage from './pages/Profile'

function App() {

  return (
    <>
        <Routes>
          <Route path="/authentication" element={<AuthPages />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/food/:id" element={<FoodDetailPage/>} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        </Routes>

    </>
  )
}

export default App
