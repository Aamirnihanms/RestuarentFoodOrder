import React, { useState, useEffect } from 'react';
import { 
  Star, 
  TrendingUp, 
  MessageSquare, 
  User,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  ThumbsUp,
  Flag,
  Award,
  AlertCircle
} from 'lucide-react';
import { getReviewData } from '../../api/dashboardApi';



export default function Reviews() {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        setLoading(true);
        const data = await getReviewData();
        setReviewData(data);
      } catch (error) {
        console.error('Error fetching review data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getOverallStats = () => {
    if (!reviewData?.mostReviewedFoods) return { totalReviews: 0, avgRating: 0, reviewedItems: 0 };
    
    const totalReviews = reviewData.mostReviewedFoods.reduce(
      (sum, food) => sum + food.reviewsCount, 
      0
    );
    
    const foodsWithReviews = reviewData.mostReviewedFoods.filter(f => f.reviewsCount > 0);
    const avgRating = foodsWithReviews.length > 0
      ? foodsWithReviews.reduce((sum, food) => sum + food.averageRating, 0) / foodsWithReviews.length
      : 0;
    
    return { totalReviews, avgRating, reviewedItems: foodsWithReviews.length };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const stats = reviewData ? getOverallStats() : { totalReviews: 0, avgRating: 0, reviewedItems: 0 };

  const getSortedAndFilteredFoods = () => {
    let foods = reviewData?.mostReviewedFoods?.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = filterRating === 'all' || 
        (filterRating === '4+' && food.averageRating >= 4) ||
        (filterRating === '3+' && food.averageRating >= 3 && food.averageRating < 4) ||
        (filterRating === 'below3' && food.averageRating < 3 && food.averageRating > 0) ||
        (filterRating === 'unrated' && food.reviewsCount === 0);
      return matchesSearch && matchesRating;
    }) || [];

    // Sort foods
    switch(sortBy) {
      case 'highest':
        return [...foods].sort((a, b) => b.averageRating - a.averageRating);
      case 'lowest':
        return [...foods].sort((a, b) => a.averageRating - b.averageRating || b.reviewsCount - a.reviewsCount);
      case 'mostReviewed':
        return [...foods].sort((a, b) => b.reviewsCount - a.reviewsCount);
      default:
        return foods;
    }
  };

  const filteredFoods = getSortedAndFilteredFoods();

  // Flatten user reviews with their food details
  const flattenedReviews = reviewData?.userReviews?.flatMap(user => 
    user.reviews.map(review => ({
      ...review,
      userName: user.userName,
      userEmail: user.userEmail,
      userId: user.userId
    }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
          <p className="text-gray-600 mt-2">Track customer feedback and improve your menu</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Star className="w-8 h-8" />
          </div>
          <p className="text-yellow-100 text-sm mb-1">Average Rating</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-4xl font-bold">
              {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—'}
            </p>
            <span className="text-yellow-100 text-lg">/ 5.0</span>
          </div>
          {stats.avgRating > 0 && (
            <div className="mt-3">
              {renderStars(Math.round(stats.avgRating))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-emerald-500 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Reviews</p>
          <p className="text-4xl font-bold text-gray-900">{stats.totalReviews}</p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.totalReviews === 0 ? 'No reviews yet' : 'From customers'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-emerald-500 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Items Reviewed</p>
          <p className="text-4xl font-bold text-gray-900">{stats.reviewedItems}</p>
          <p className="text-xs text-gray-500 mt-2">
            Out of {reviewData?.mostReviewedFoods?.length || 0} items
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-emerald-500 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Active Reviewers</p>
          <p className="text-4xl font-bold text-gray-900">{reviewData?.userReviews?.length || 0}</p>
          <p className="text-xs text-gray-500 mt-2">
            {reviewData?.userReviews?.length === 0 ? 'No reviewers yet' : 'Unique customers'}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none bg-white cursor-pointer transition-all"
            >
              <option value="all">All Ratings</option>
              <option value="4+">⭐ 4+ Stars (Excellent)</option>
              <option value="3+">⭐ 3-4 Stars (Good)</option>
              <option value="below3">⭐ Below 3 Stars</option>
              <option value="unrated">Not Rated Yet</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none bg-white cursor-pointer transition-all"
            >
              <option value="recent">Most Recent First</option>
              <option value="highest">Highest Rated First</option>
              <option value="lowest">Lowest Rated First</option>
              <option value="mostReviewed">Most Reviewed First</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Menu Items Performance</h2>
          <span className="text-sm text-gray-600">
            {filteredFoods.length} {filteredFoods.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredFoods.map((food) => (
              <div 
                key={food._id} 
                className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100 hover:border-emerald-200"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">{food.name}</h3>
                    {food.averageRating >= 4.5 && food.reviewsCount > 0 && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        Top Rated
                      </span>
                    )}
                  </div>
                  
                  {food.reviewsCount > 0 ? (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {renderStars(food.averageRating)}
                        <span className="text-lg font-bold text-gray-900">
                          {food.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        • {food.reviewsCount} {food.reviewsCount === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">No customer reviews yet</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  {food.reviewsCount > 0 && (
                    <span className={`px-4 py-2 text-sm font-bold rounded-lg ${
                      food.averageRating >= 4.5
                        ? 'bg-green-100 text-green-800'
                        : food.averageRating >= 4
                        ? 'bg-emerald-100 text-emerald-800'
                        : food.averageRating >= 3
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {food.averageRating >= 4.5 ? '🌟 Outstanding' : 
                       food.averageRating >= 4 ? '✨ Excellent' : 
                       food.averageRating >= 3 ? '👍 Good' : 
                       '⚠️ Needs Attention'}
                    </span>
                  )}
                  {food.reviewsCount === 0 && (
                    <span className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 text-gray-600 border-2 border-dashed border-gray-300">
                      Awaiting Reviews
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold mb-2">No items found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
          <span className="text-sm text-gray-600">
            {flattenedReviews.length} {flattenedReviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>
        
        {flattenedReviews.length > 0 ? (
          <div className="space-y-4">
            {flattenedReviews.map((review, index) => (
              <div key={index} className="p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {review.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{review.userName}</p>
                      <p className="text-sm text-gray-600 mb-2">Reviewed: <span className="font-semibold text-emerald-600">{review.foodName}</span></p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating)}
                    <span className="font-bold text-gray-900 text-lg ml-1">{review.rating}.0</span>
                  </div>
                </div>
                
                <div className="ml-16 mb-4">
                  <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-gray-100">
                    "{review.comment}"
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 text-sm ml-16">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors px-3 py-2 rounded-lg hover:bg-emerald-50">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="font-medium">Helpful</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
                    <Flag className="w-4 h-4" />
                    <span className="font-medium">Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold mb-2">No customer reviews yet</p>
            <p className="text-gray-500 text-sm mb-4">Reviews will appear here once customers start rating your food items</p>
            <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
              <Star className="w-4 h-4 mr-2" />
              Encourage customers to leave reviews!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}