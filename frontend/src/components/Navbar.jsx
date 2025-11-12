import React, { useState } from 'react';
import { ChefHat, ShoppingCart, User, Menu, X, Search, Home, UtensilsCrossed, Phone, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
export default function Navbar({ cartCount = 0, isAuthenticated = false }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

    const { logout } = useContext(AuthContext);
  
  // Check if user is authenticated and has 'user' role
  const checkUserAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.role === 'user';
      } catch (error) {
        return false;
      }
    }
    return false;
  };
  
  const isUserAuthenticated = checkUserAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full p-2">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              FreshBite
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="flex items-center space-x-1 text-gray-700 hover:text-emerald-500 transition-colors font-medium">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </a>
            <a href="#menu" className="flex items-center space-x-1 text-gray-700 hover:text-emerald-500 transition-colors font-medium">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Menu</span>
            </a>
            <a href="#about" className="text-gray-700 hover:text-emerald-500 transition-colors font-medium">
              About
            </a>
            <a href="#contact" className="flex items-center space-x-1 text-gray-700 hover:text-emerald-500 transition-colors font-medium">
              <Phone className="w-4 h-4" />
              <span>Contact</span>
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="hidden md:block p-2 text-gray-600 hover:text-emerald-500 hover:bg-emerald-50 rounded-full transition-all">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart - Only show if user is authenticated with 'user' role */}
            {isUserAuthenticated && (
              <button onClick={() => { navigate("/cart") }} className="relative p-2 text-gray-600 hover:text-emerald-500 hover:bg-emerald-50 rounded-full transition-all">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile / Auth */}
            {isUserAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <button onClick={() => navigate('/profile')} className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-all">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </button>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={() => { navigate('/authentication') }} className="hidden md:block px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all shadow-md">
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            <a href="#home" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all">
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </a>
            <a href="#menu" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all">
              <UtensilsCrossed className="w-5 h-5" />
              <span className="font-medium">Menu</span>
            </a>
            <a href="#about" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all">
              <span className="font-medium">About</span>
            </a>
            <a href="#contact" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Contact</span>
            </a>
            <div className="pt-3 border-t border-gray-100">
              {isUserAuthenticated ? (
                <>
                  <button className="w-full flex items-center space-x-2 px-4 py-2 text-emerald-600 bg-emerald-50 rounded-lg font-medium mb-2">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </button>
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button onClick={() => { navigate('/authentication') }} className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}