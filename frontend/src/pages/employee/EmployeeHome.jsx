import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, Phone, DollarSign, CheckCircle, XCircle, AlertCircle, User, ShoppingBag, Loader, Hash } from 'lucide-react';
import { getEmployeeOrders,confirmEmployeeOrder,completeEmployeeOrder } from '../../api/employeeApi';

export default function EmployeeOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [processingOrder, setProcessingOrder] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getEmployeeOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleConfirmOrder = async (orderId) => {
    setProcessingOrder(orderId);
    try {
      // Simulate API call to confirm order
        await confirmEmployeeOrder(orderId);
        loadOrders();
    } catch (error) {
      console.error('Error confirming order:', error);
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleStartDelivery = async (orderId) => {
    setProcessingOrder(orderId);
    try {
      // Simulate API call to start delivery
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'Out for Delivery' }
          : order
      ));
    } catch (error) {
      console.error('Error starting delivery:', error);
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleDeliveryComplete = (order) => {
    setSelectedOrder(order);
    setShowPinModal(true);
    setPin('');
    setPinError('');
  };

  const verifyPin = async () => {
    if (pin.length !== 6) {
      setPinError('PIN must be 6 digits');
      return;
    }

    if (!/^\d+$/.test(pin)) {
      setPinError('PIN must contain only numbers');
      return;
    }

    setProcessingOrder(selectedOrder._id);
    try {
      // Simulate API call to verify PIN and complete delivery
        await completeEmployeeOrder(selectedOrder._id, pin);
      
      setShowPinModal(false);
      setSelectedOrder(null);
      setPin('');
    } catch (error) {
      setPinError('Failed to verify PIN. Please try again.');
    } finally {
      setProcessingOrder(null);
    }
  };

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const orderCounts = {
    All: orders.length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Confirmed: orders.filter(o => o.status === 'Confirmed').length,
    'Out for Delivery': orders.filter(o => o.status === 'Out for Delivery').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Delivery Dashboard</h1>
              <p className="text-emerald-100">Manage your assigned orders</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{orders.length}</div>
              <div className="text-emerald-100">Total Orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-4">
            {['All', 'Pending', 'Confirmed', 'Out for Delivery', 'Delivered'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  filter === status
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status} ({orderCounts[status]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-12 h-12 text-emerald-500 animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Orders Found</h3>
            <p className="text-gray-500">No {filter.toLowerCase()} orders at the moment</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Package className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Order ID</div>
                        <div className="font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-4 py-2 rounded-full font-semibold text-sm border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total</div>
                        <div className="text-xl font-bold text-emerald-600">${order.totalPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-500">Customer</div>
                          <div className="font-semibold text-gray-800">{order.userName}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-500">Delivery Address</div>
                          <div className="font-semibold text-gray-800">{order.deliveryAddress}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-500">Order Time</div>
                          <div className="font-semibold text-gray-800">
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-semibold">${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-semibold">${order.deliveryFee.toFixed(2)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Discount ({order.appliedPromo})</span>
                          <span className="font-semibold text-green-600">-${order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-semibold">{order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <ShoppingBag className="w-5 h-5 mr-2 text-emerald-600" />
                      Order Items ({order.items.length})
                    </h4>
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item._id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-3">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              {item.size} • Qty: {item.quantity}
                            </div>
                          </div>
                          <div className="font-bold text-emerald-600">${item.totalItemPrice.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => handleConfirmOrder(order._id)}
                        disabled={processingOrder === order._id}
                        className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        {processingOrder === order._id ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Confirm Order</span>
                          </>
                        )}
                      </button>
                    )}

                    {order.status === 'Confirmed' && (
                      <button
                        onClick={() => handleStartDelivery(order._id)}
                        disabled={processingOrder === order._id}
                        className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        {processingOrder === order._id ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Package className="w-5 h-5" />
                            <span>Start Delivery</span>
                          </>
                        )}
                      </button>
                    )}

                    {order.status === 'Out for Delivery' && (
                      <button
                        onClick={() => handleDeliveryComplete(order)}
                        className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Complete Delivery</span>
                      </button>
                    )}

                    {order.status === 'Delivered' && order.deliveryPin && (
                      <div className="flex-1 min-w-[200px] px-6 py-3 bg-green-50 border-2 border-green-200 rounded-lg flex items-center justify-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-700">Delivered • PIN: {order.deliveryPin}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-emerald-100 rounded-full mb-4">
                <Hash className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Enter Delivery PIN</h3>
              <p className="text-gray-600">Ask the customer for their 6-digit delivery PIN</p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ''));
                  setPinError('');
                }}
                placeholder="000000"
                className="w-full text-center text-3xl font-bold tracking-widest px-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
              {pinError && (
                <div className="flex items-center space-x-2 text-red-600 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{pinError}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setSelectedOrder(null);
                  setPin('');
                  setPinError('');
                }}
                disabled={processingOrder}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Cancel
              </button>
              <button
                onClick={verifyPin}
                disabled={processingOrder || pin.length !== 6}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {processingOrder ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Verify & Complete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}