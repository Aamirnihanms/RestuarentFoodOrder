import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChefHat, Clock, Star, Heart, ShoppingCart, Minus, Plus, ArrowLeft, Award, Flame, Users, CheckCircle, Loader, X, LogIn } from 'lucide-react';
import { getFoodById } from '../api/foodApi';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { addReview } from '../api/reviewApi';
import ReviewModal from '../components/ReviewModal';
import { addToCart } from '../api/cartApi';
import toast from 'react-hot-toast';

export default function FoodDetailPage() {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('Regular');
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                setLoading(true);
                const res = await getFoodById(id);
                setFood(res);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to load food details');
                console.error('Error fetching food details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFoodDetails();
    }, [id]);

    const handleReviewSubmit = async (reviewData) => {
        try {
            await addReview(id, reviewData);
            
            const res = await getFoodById(id);
            setFood(res);
        } catch (err) {
            // console.error('Error submitting review:', err);
            throw err;
        }
    };

    const handleAddToCart = async () => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (!token || !userStr) {
            setShowAuthModal(true);
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'user') {
                setShowAuthModal(true);
                return;
            }
        } catch (err) {
            // console.error('Error parsing user data:', err);
            setShowAuthModal(true);
            return;
        }

        // Proceed with adding to cart
        try {
            setIsAddingToCart(true);
            
            const foodData = {
                foodId: id,
                size: selectedSize,
                quantity: quantity,
                totalPrice: parseFloat(totalPrice)
            };

            await addToCart(foodData);
            
            toast.success('Item added to cart successfully!');
            
        } catch (err) {
            // console.error('Error adding to cart:', err);
            toast.error('Failed to add item to cart. Please try again.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };
    
    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Loading delicious details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!food) return null;

    const totalPrice = (food.price * quantity).toFixed(2);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            {/* Auth Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogIn className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In Required</h2>
                            <p className="text-gray-600 text-lg">
                                Please sign in to add items to your cart and enjoy our delicious meals!
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-semibold text-gray-800">Track Your Orders</div>
                                    <div className="text-sm text-gray-600">Keep track of all your food orders</div>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-semibold text-gray-800">Save Favorites</div>
                                    <div className="text-sm text-gray-600">Build your personalized menu</div>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-semibold text-gray-800">Faster Checkout</div>
                                    <div className="text-sm text-gray-600">Save time with stored information</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/authentication')}
                                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105"
                            >
                                Sign Up Now
                            </button>
                            {/* <button
                                onClick={() => navigate('/authentication')}
                                className="w-full py-4 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all"
                            >
                                Already Have an Account? Sign In
                            </button> */}
                        </div>
                    </div>
                </div>
            )}

            {/* Navbar */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button onClick={() => handleBack()} className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-semibold">Back to Menu</span>
                        </button>
                        <div className="flex items-center space-x-2">
                            <ChefHat className="w-6 h-6 text-emerald-600" />
                            <span className="text-xl font-bold text-gray-800">FreshBite</span>
                        </div>
                        <button onClick={() => {navigate('/cart')}} className="p-2 hover:bg-emerald-50 rounded-full transition-colors">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-4">
                            <img
                                src={food.images[currentImageIndex]}
                                alt={food.name}
                                className="w-full h-96 object-cover"
                            />
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-emerald-50 transition-all"
                            >
                                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                            </button>
                            {!food.available && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">Currently Unavailable</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex space-x-4">
                            {food.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-24 h-24 rounded-xl overflow-hidden border-4 transition-all ${currentImageIndex === index
                                            ? 'border-emerald-500 shadow-lg'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="bg-white rounded-3xl shadow-xl p-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-2">
                                        {food.category}
                                    </span>
                                    <h1 className="text-4xl font-bold text-gray-800 mb-2">{food.name}</h1>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 mb-6">
                                <div className="flex items-center space-x-1">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-lg">{food.rating}</span>
                                    <span className="text-gray-500">({food.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Clock className="w-5 h-5" />
                                    <span>{food.prepTime}</span>
                                </div>
                            </div>

                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">{food.description}</p>

                            {/* Size Selection */}
                            {food.sizes && food.sizes.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Select Size</label>
                                    <div className="flex space-x-3">
                                        {food.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${selectedSize === size
                                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-3">Quantity</label>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={decreaseQuantity}
                                        className="w-12 h-12 rounded-full bg-gray-100 hover:bg-emerald-100 flex items-center justify-center transition-all"
                                    >
                                        <Minus className="w-5 h-5 text-gray-700" />
                                    </button>
                                    <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={increaseQuantity}
                                        className="w-12 h-12 rounded-full bg-gray-100 hover:bg-emerald-100 flex items-center justify-center transition-all"
                                    >
                                        <Plus className="w-5 h-5 text-gray-700" />
                                    </button>
                                </div>
                            </div>

                            {/* Nutrition Info */}
                            {food.nutritionInfo && (
                                <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-emerald-50 rounded-xl">
                                    <div className="text-center">
                                        <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                                        <div className="text-sm font-bold text-gray-800">{food.nutritionInfo.calories}</div>
                                        <div className="text-xs text-gray-600">Calories</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-gray-800">{food.nutritionInfo.protein}</div>
                                        <div className="text-xs text-gray-600">Protein</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-gray-800">{food.nutritionInfo.carbs}</div>
                                        <div className="text-xs text-gray-600">Carbs</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-gray-800">{food.nutritionInfo.fat}</div>
                                        <div className="text-xs text-gray-600">Fat</div>
                                    </div>
                                </div>
                            )}

                            {/* Price and Add to Cart */}
                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl">
                                <div className="text-white">
                                    <div className="text-sm opacity-90">Total Price</div>
                                    <div className="text-4xl font-bold">${totalPrice}</div>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!food.available || isAddingToCart}
                                    className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center space-x-3 transition-all ${food.available && !isAddingToCart
                                            ? 'bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg hover:shadow-xl transform hover:scale-105'
                                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <Loader className="w-6 h-6 animate-spin" />
                                            <span>Adding...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-6 h-6" />
                                            <span>Add to Cart</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
                    <div className="flex space-x-6 border-b border-gray-200 mb-6">
                        {['description', 'ingredients', 'reviews'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 px-2 font-semibold capitalize transition-all ${activeTab === tab
                                        ? 'text-emerald-600 border-b-2 border-emerald-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Description Tab */}
                    {activeTab === 'description' && (
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">About This Dish</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">{food.longDescription}</p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl">
                                    <Award className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <div className="font-bold text-gray-800 mb-1">Chef's Special</div>
                                        <div className="text-sm text-gray-600">Prepared by expert chefs</div>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl">
                                    <Flame className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                                    <div>
                                        <div className="font-bold text-gray-800 mb-1">Freshly Made</div>
                                        <div className="text-sm text-gray-600">Cooked to order</div>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl">
                                    <Users className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <div className="font-bold text-gray-800 mb-1">Popular Choice</div>
                                        <div className="text-sm text-gray-600">Loved by customers</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ingredients Tab */}
                    {activeTab === 'ingredients' && (
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h3>
                            {food.ingredients && food.ingredients.length > 0 && (
                                <div className="grid md:grid-cols-3 gap-3 mb-6">
                                    {food.ingredients.map((ingredient, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            <span className="text-gray-700">{ingredient}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {food.allergens && food.allergens.length > 0 && (
                                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                    <div className="font-bold text-gray-800 mb-2">⚠️ Allergen Information</div>
                                    <div className="text-gray-600">
                                        Contains: {food.allergens.join(', ')}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Customer Reviews</h3>
                                <button
                                    onClick={() => setIsReviewModalOpen(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                                >
                                    Write a Review
                                </button>
                            </div>

                            <div className="space-y-6">
                                {food.reviewsList && food.reviewsList.length > 0 ? (
                                    food.reviewsList.map(review => (
                                        <div key={review._id} className="p-6 bg-gray-50 rounded-xl">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="font-bold text-gray-800">{review.name}</span>
                                                        <span className="flex items-center text-xs text-emerald-600">
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Verified Purchase
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < review.rating
                                                                            ? 'text-yellow-400 fill-yellow-400'
                                                                            : 'text-gray-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={handleReviewSubmit}
                foodName={food.name}
            />
        </div>
    );
}