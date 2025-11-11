import React, { useState, useEffect } from 'react';
import { ChefHat, ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Tag, MapPin, Clock, CreditCard, Percent, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { getCart } from '../api/cartApi';
import { createOrder } from '../api/orderApi';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [deliveryType, setDeliveryType] = useState('delivery');

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
const [paymentMethod, setPaymentMethod] = useState('Online');
const [deliveryAddress, setDeliveryAddress] = useState('');
const [isProcessingPayment, setIsProcessingPayment] = useState(false);
const [orderSuccess, setOrderSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCartItems(response);
      setError(null);
    } catch (err) {
      setError('Failed to load cart. Please try again.');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item._id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'FRESH20') {
      setAppliedPromo({ code: 'FRESH20', discount: 20, type: 'percentage' });
    } else if (promoCode.toUpperCase() === 'SAVE10') {
      setAppliedPromo({ code: 'SAVE10', discount: 10, type: 'fixed' });
    } else {
      alert('Invalid promo code');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const handleCheckoutClick = () => {
  setShowCheckoutModal(true);
};

const handlePlaceOrder = async () => {
  if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
    alert('Please enter delivery address');
    return;
  }

  setIsProcessingPayment(true);


  setTimeout(async () => {
    try {
      console.log(cartItems)
      const orderPayload = {
        selectedItems: cartItems.map(item => ({ foodId: item.foodId })),
        paymentMethod: paymentMethod,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : 'Pickup from store'
      };

      const response = await createOrder(orderPayload);
      setOrderSuccess(true);
      

      setTimeout(() => {
        setCartItems([]);
        setShowCheckoutModal(false);
        setOrderSuccess(false);
        setIsProcessingPayment(false);
        setDeliveryAddress('');
        navigate('/home');
      }, 3000);

    } catch (error) {
      setIsProcessingPayment(false);
      alert('Order failed. Please try again.');
      console.error('Order error:', error);
    }
  }, 2000);
};


  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryType === 'delivery' ? 5.99 : 0;
  const tax = subtotal * 0.08;
  
  let discount = 0;
  if (appliedPromo) {
    discount = appliedPromo.type === 'percentage' 
      ? (subtotal * appliedPromo.discount / 100)
      : appliedPromo.discount;
  }
  
  const total = subtotal + deliveryFee + tax - discount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-800 font-bold text-xl mb-2">Oops! Something went wrong</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchCart}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={()=>{(navigate('/home'))}} className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Continue Shopping</span>
            </button>
            <div className="flex items-center space-x-2">
              <ChefHat className="w-6 h-6 text-emerald-600" />
              <span className="text-xl font-bold text-gray-800">FreshBite</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 rounded-full">
              <ShoppingCart className="w-5 h-5 text-emerald-700" />
              <span className="font-bold text-emerald-700">{cartItems.length} Items</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <ShoppingCart className="w-8 h-8 text-emerald-600 mr-3" />
                Your Cart
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
                  <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl hover:shadow-md transition-shadow">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                            <span className="inline-block px-3 py-1 bg-white text-emerald-700 text-xs font-semibold rounded-full mt-1">
                              {item.category}
                            </span>
                          </div>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="p-2 hover:bg-red-100 rounded-full transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Package className="w-4 h-4 mr-1" />
                            Size: {item.size}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {item.prepTime}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-10 h-10 rounded-full bg-white hover:bg-emerald-100 flex items-center justify-center transition-all shadow-sm"
                            >
                              <Minus className="w-4 h-4 text-gray-700" />
                            </button>
                            <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-10 h-10 rounded-full bg-white hover:bg-emerald-100 flex items-center justify-center transition-all shadow-sm"
                            >
                              <Plus className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery Type Selection */}
            {cartItems.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Delivery Options</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      deliveryType === 'delivery'
                        ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <MapPin className={`w-6 h-6 mb-2 ${deliveryType === 'delivery' ? 'text-emerald-600' : 'text-gray-500'}`} />
                    <div className="font-bold text-gray-800">Delivery</div>
                    <div className="text-sm text-gray-600">35-45 min • $5.99</div>
                  </button>
                  <button
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      deliveryType === 'pickup'
                        ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <Package className={`w-6 h-6 mb-2 ${deliveryType === 'pickup' ? 'text-emerald-600' : 'text-gray-500'}`} />
                    <div className="font-bold text-gray-800">Pickup</div>
                    <div className="text-sm text-gray-600">20-25 min • Free</div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Promo Code</label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-emerald-700">{appliedPromo.code}</span>
                      </div>
                      <button
                        onClick={removePromo}
                        className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  <div className="mt-2 flex items-start space-x-2 text-xs text-gray-600">
                    <Tag className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Try: FRESH20 (20% off) or SAVE10 ($10 off)</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">
                      {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (8%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span className="flex items-center">
                        <Percent className="w-4 h-4 mr-1" />
                        Discount
                      </span>
                      <span className="font-semibold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-3xl font-bold text-emerald-600">${total.toFixed(2)}</span>
                </div>

                {/* Estimated Time */}
                <div className="mb-6 p-4 bg-emerald-50 rounded-xl flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-emerald-600" />
                  <div>
                    <div className="font-bold text-gray-800">Estimated Time</div>
                    <div className="text-sm text-gray-600">
                      {deliveryType === 'delivery' ? '35-45 minutes' : '20-25 minutes'}
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
<button 
  onClick={handleCheckoutClick}
  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
>
  <CreditCard className="w-6 h-6" />
  <span>Proceed to Checkout</span>
</button>

                {/* Security Note */}
                <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Checkout Modal */}
{showCheckoutModal && (
  <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
      {!isProcessingPayment && !orderSuccess && (
        <>
          <button
            onClick={() => setShowCheckoutModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Complete Your Order</h2>

          {/* Delivery Address */}
          {deliveryType === 'delivery' && (
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Delivery Address
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your complete delivery address"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none resize-none"
                rows="3"
              />
            </div>
          )}

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Payment Method
            </label>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('Online')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  paymentMethod === 'Online'
                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-800">Online Payment</div>
                    <div className="text-sm text-gray-600">Pay via Card/UPI/Wallet</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    paymentMethod === 'Online' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'Online' && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('COD')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-800">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    paymentMethod === 'COD' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'COD' && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-bold text-2xl text-emerald-600">${total.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-500">
              {cartItems.length} items • {deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
          >
            Place Order
          </button>
        </>
      )}

      {/* Processing Payment Animation */}
      {isProcessingPayment && !orderSuccess && (
        <div className="text-center py-8">
          <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h3>
          <p className="text-gray-600">Please wait while we process your order...</p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {orderSuccess && (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h3>
          <p className="text-gray-600 mb-4">Thank you for your order</p>
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-sm text-emerald-700 font-semibold">
              Estimated {deliveryType === 'delivery' ? 'delivery' : 'pickup'} time: {deliveryType === 'delivery' ? '35-45 min' : '20-25 min'}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
)}
      </div>
    </div>
  );
}