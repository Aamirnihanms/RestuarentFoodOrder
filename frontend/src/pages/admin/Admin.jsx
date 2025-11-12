import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Users, 
  Settings, 
  BarChart3, 
  Bell, 
  Search,
  Menu,
  X,
  Plus,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  ChevronDown,
  LogOut,
  User,
  FileText,
  Tag,
  MessageSquare
} from 'lucide-react';
import { getDashboardData } from '../../api/dashboardApi';
import Orders from './Orders';
import Foods from './Foods';
import Customers from './Customers';
import Reviews from './Review';
import Logs from './Log';
import SettingsData from './Settings';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);


  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    localStorage.clear();
    navigate('/');
  }

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders', badge: dashboardData?.totalOrders?.toString() },
    { id: 'foods', icon: UtensilsCrossed, label: 'Food Items' },
    // { id: 'categories', icon: Tag, label: 'Categories' },
    { id: 'customers', icon: Users, label: 'Customers' },
    // { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'reviews', icon: MessageSquare, label: 'Reviews' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const stats = dashboardData ? [
    { 
      label: 'Total Revenue', 
      value: `$${dashboardData.totalRevenue?.toFixed(2) || '0.00'}`, 
      change: dashboardData.monthlyRevenue?.length > 0 ? '+' + ((dashboardData.monthlyRevenue[0].totalRevenue / dashboardData.totalRevenue) * 100).toFixed(1) + '%' : '0%', 
      icon: DollarSign, 
      color: 'bg-emerald-500' 
    },
    { 
      label: 'Total Orders', 
      value: dashboardData.totalOrders?.toString() || '0', 
      change: '+' + (dashboardData.ordersByStatus?.reduce((sum, o) => sum + o.count, 0) || 0), 
      icon: ShoppingBag, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Active Items', 
      value: dashboardData.totalFoods?.toString() || '0', 
      change: '+0', 
      icon: Package, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Customers', 
      value: dashboardData.totalUsers?.toString() || '0', 
      change: '+0', 
      icon: Users, 
      color: 'bg-orange-500' 
    },
  ] : [];

  const getMonthName = (monthNum) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1] || '';
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && <span className="text-xl font-bold text-emerald-600">FreshBite Admin</span>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 mb-1 transition-colors ${
                activeTab === item.id
                  ? 'bg-emerald-50 text-emerald-600 border-r-4 border-emerald-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="ml-3 font-medium flex-1 text-left">{item.label}</span>
              )}
              {sidebarOpen && item.badge && (
                <span className="ml-auto bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              JD
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders, items, customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  JD
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </a>
                  <hr className="my-2" />
                  <button onClick={handleLogout} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                  <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add New Item</span>
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
              ) : (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`${stat.color} p-3 rounded-lg`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-green-600 text-sm font-semibold flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {stat.change}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Orders by Status & Monthly Revenue */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Orders by Status */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-4">Orders by Status</h2>
                      {dashboardData?.ordersByStatus && dashboardData.ordersByStatus.length > 0 ? (
                        <div className="space-y-3">
                          {dashboardData.ordersByStatus.map((order, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                              <span className="text-lg font-bold text-gray-800">{order.count}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No orders yet</p>
                      )}
                    </div>

                    {/* Monthly Revenue */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-4">Monthly Revenue</h2>
                      {dashboardData?.monthlyRevenue && dashboardData.monthlyRevenue.length > 0 ? (
                        <div className="space-y-3">
                          {dashboardData.monthlyRevenue.map((revenue, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                                <span className="font-medium text-gray-700">{getMonthName(revenue.month)}</span>
                              </div>
                              <span className="text-lg font-bold text-gray-800">${revenue.totalRevenue.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No revenue data yet</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab === 'orders' && <Orders />}
          {activeTab === 'foods' && <Foods />}
          {activeTab === 'customers' && <Customers />}
          {activeTab === 'reviews' && <Reviews />}
          {activeTab === 'reports' && <Logs />}
          {activeTab === 'settings' && <SettingsData />}
          {/* {activeTab !== 'dashboard' && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="inline-block p-4 bg-emerald-100 rounded-full mb-4">
                {menuItems.find(item => item.id === activeTab)?.icon && 
                  React.createElement(menuItems.find(item => item.id === activeTab).icon, { 
                    className: "w-12 h-12 text-emerald-600" 
                  })
                }
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          )} */}
        </main>
      </div>
    </div>
  );
}