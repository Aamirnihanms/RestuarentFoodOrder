import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, CreditCard, Settings, LogOut, Clock, CheckCircle, XCircle, Truck, ChefHat, Edit2, Save, X, ArrowLeft, Plus, Trash2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../api/orderApi';
import { getAddress,removeAddress,setDefaultAddress,addAdress } from '../api/addressApi';



export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  
  // Address states
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: ''
  });

  // Get user info from localStorage
  const storedUser = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('user') || '{"name":"Guest","email":"guest@example.com"}')
    : { name: 'Guest', email: 'guest@example.com' };

  const [userInfo, setUserInfo] = useState({
    name: storedUser.name || 'Guest User',
    email: storedUser.email || 'user@example.com',
    phone: '',
  });
  const [editedInfo, setEditedInfo] = useState(userInfo);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fetch addresses from API
  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);

  const fetchAddresses = async () => {
    try {
      setAddressLoading(true);
      const data = await getAddress();
      setAddresses(data);
      setAddressError(null);
    } catch (err) {
      setAddressError('Failed to load addresses');
      console.error('Error fetching addresses:', err);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      await addAdress(newAddress);
      setShowAddressForm(false);
      setNewAddress({
        label: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
      });
      fetchAddresses(); // Refresh the list
    } catch (err) {
      console.error('Error adding address:', err);
      alert('Failed to add address');
    }
  };

  const handleDeleteAddress = async (index) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await removeAddress(index);
        fetchAddresses(); // Refresh the list
      } catch (err) {
        console.error('Error deleting address:', err);
        alert('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (index) => {
    console.log('Setting default address at index:', index);
    try {
      await setDefaultAddress(index);
      fetchAddresses(); 
    } catch (err) {
      console.error('Error setting default address:', err);
      alert('Failed to set default address');
    }
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status.toLowerCase();
    switch(normalizedStatus) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-transit':
      case 'out for delivery':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'preparing':
      case 'confirmed':
        return <ChefHat className="w-5 h-5 text-orange-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const normalizedStatus = status.toLowerCase();
    switch(normalizedStatus) {
      case 'delivered':
        return { text: 'Delivered', color: 'text-green-600 bg-green-50' };
      case 'in-transit':
      case 'out for delivery':
        return { text: 'In Transit', color: 'text-blue-600 bg-blue-50' };
      case 'preparing':
        return { text: 'Preparing', color: 'text-orange-600 bg-orange-50' };
      case 'confirmed':
        return { text: 'Confirmed', color: 'text-purple-600 bg-purple-50' };
      case 'cancelled':
        return { text: 'Cancelled', color: 'text-red-600 bg-red-50' };
      case 'pending':
        return { text: 'Pending', color: 'text-yellow-600 bg-yellow-50' };
      default:
        return { text: status, color: 'text-gray-600 bg-gray-50' };
    }
  };

  const handleSaveProfile = () => {
    setUserInfo(editedInfo);
    setIsEditingProfile(false);
    // Add API call here to save profile
  };

  const handleCancelEdit = () => {
    setEditedInfo(userInfo);
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={()=>{navigate('/')}} className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Continue Shopping</span>
            </button>
            <div className="flex items-center space-x-2">
              <ChefHat className="w-6 h-6 text-emerald-600" />
              <span className="text-xl font-bold text-gray-800">FreshBite</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-12">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
              <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-800">{userInfo.name}</h1>
                <p className="text-gray-600">{userInfo.email}</p>
                <div className="flex items-center justify-center md:justify-start space-x-4 mt-2">
                  <span className="text-sm text-gray-500">Member since Nov 2024</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                    Gold Member
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-semibold">My Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-semibold">Profile Info</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">Addresses</span>
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'payment'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-semibold">Payment Methods</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-semibold">Settings</span>
              </button>
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all">
                  <LogOut className="w-5 h-5" />
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* My Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
                  <span className="text-gray-600">{orders.length} total orders</span>
                </div>

                {loading ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading orders...</p>
                  </div>
                ) : error ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No orders yet</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                      {/* Order Header */}
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-800">Order #{order._id.slice(-8)}</h3>
                              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusText(order.status).color}`}>
                                {getStatusIcon(order.status)}
                                <span className="text-sm font-semibold">{getStatusText(order.status).text}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <div className="mt-4 md:mt-0 text-left md:text-right">
                            <p className="text-2xl font-bold text-emerald-600">${order.totalPrice.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        <div className="space-y-4 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center overflow-hidden">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <ChefHat className="w-8 h-8 text-emerald-600" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-800">${item.totalItemPrice.toFixed(2)}</p>
                                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                              </div>
                            </div>
                          ))}
                        </div>

{/* Delivery Address */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex items-start space-x-3">
                            <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">Delivery Address</p>
                              <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                            </div>
                          </div>
                        </div>

                        {/* Delivery PIN - Show when status is Confirmed */}
                        {order.status.toLowerCase() === 'confirmed' && order.deliveryPin && (
                          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 mb-4 border-2 border-emerald-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="bg-emerald-500 rounded-full p-2">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-700">Delivery PIN</p>
                                  <p className="text-xs text-gray-600">Share this PIN with the delivery person</p>
                                </div>
                              </div>
                              <div className="bg-white px-4 py-2 rounded-lg border-2 border-emerald-300">
                                <p className="text-2xl font-bold text-emerald-600 tracking-wider">{order.deliveryPin}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md">
                            Track Order
                          </button>
                          <button className="px-6 py-2 bg-white border-2 border-emerald-500 text-emerald-600 rounded-full font-semibold hover:bg-emerald-50 transition-all">
                            Reorder
                          </button>
                          {order.status.toLowerCase() === 'delivered' && (
                            <button className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all">
                              Leave Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Profile Info Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                  {!isEditingProfile ? (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full font-semibold hover:bg-emerald-200 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={isEditingProfile ? editedInfo.name : userInfo.name}
                      onChange={(e) => setEditedInfo({...editedInfo, name: e.target.value})}
                      disabled={!isEditingProfile}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={isEditingProfile ? editedInfo.email : userInfo.email}
                      onChange={(e) => setEditedInfo({...editedInfo, email: e.target.value})}
                      disabled={!isEditingProfile}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={isEditingProfile ? editedInfo.phone : userInfo.phone}
                      onChange={(e) => setEditedInfo({...editedInfo, phone: e.target.value})}
                      disabled={!isEditingProfile}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddressForm && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Add New Address</h3>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Label (Home, Work, etc.)</label>
                        <input
                          type="text"
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="e.g., Home"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Phone number"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Street address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State/Province</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">zip/Postal Code</label>
                        <input
                          type="text"
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="zip code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setShowAddressForm(false)}
                        // This is the continuation of the first code document

                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddAddress}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                )}

                {/* Address List */}
                {addressLoading ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading addresses...</p>
                  </div>
                ) : addressError ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">{addressError}</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No saved addresses yet</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {addresses.map((address, index) => (
                      <div
                        key={index}
                        className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all ${
                          address.isDefault ? 'ring-2 ring-emerald-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-800">{address.label}</h3>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>Default</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteAddress(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-2 mb-4">
                          <p className="text-gray-700">{address.street}</p>
                          <p className="text-gray-700">
                            {address.city}, {address.state} {address.zip}
                          </p>
                          <p className="text-gray-700">{address.country}</p>
                          <p className="text-gray-600 flex items-center space-x-2">
                            <span className="text-sm">📞</span>
                            <span>{address.phone}</span>
                          </p>
                        </div>

                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(index)}
                            className="w-full px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full font-semibold hover:bg-emerald-200 transition-all"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Methods</h2>
                <p className="text-gray-600">Your saved payment methods will appear here.</p>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
                <p className="text-gray-600">Account settings and preferences will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 