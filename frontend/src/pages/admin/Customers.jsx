import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  MoreVertical,
  Eye,
  Ban,
  Trash2,
  Download,
  RefreshCw,
  Edit,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { getAllUsersData, softDeleteUserData, restoreUserData } from '../../api/dashboardApi';
import toast from 'react-hot-toast';

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'delete', loading }) => {
  if (!isOpen) return null;

  const isDelete = type === 'delete';
  const buttonColor = isDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const iconColor = isDelete ? 'text-red-600' : 'text-green-600';
  const bgColor = isDelete ? 'bg-red-50' : 'bg-green-50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`${bgColor} p-3 rounded-full`}>
              {isDelete ? (
                <AlertTriangle className={`w-6 h-6 ${iconColor}`} />
              ) : (
                <CheckCircle className={`w-6 h-6 ${iconColor}`} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${buttonColor}`}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </span>
            ) : (
              isDelete ? 'Disable User' : 'Restore User'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// User Details View Modal Component
const UserDetailsModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Profile Section */}
          <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900">{user.name}</h4>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <Mail className="w-4 h-4 mr-1" />
                {user.email}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {user.isDeleted ? (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Deleted</span>
              ) : user.isActive ? (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
              ) : (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>
              )}
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'moderator' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Account Information</h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">User ID</p>
                <p className="text-sm font-medium text-gray-900">{user._id}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Member Since</p>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Account Status</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.isDeleted ? 'Deleted' : user.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          {/* Cart Information */}
          <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-3">
              Shopping Cart ({user.cart.length} items)
            </h5>
            {user.cart.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {user.cart.map((item) => (
                  <div key={item._id} className="bg-gray-50 p-4 rounded-lg flex items-start space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h6 className="text-sm font-semibold text-gray-900">{item.name}</h6>
                      <p className="text-xs text-gray-600 mt-1">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-600">
                          {item.size} • Qty: {item.quantity}
                        </span>
                        <span className="text-sm font-bold text-emerald-600">
                          ${item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-emerald-50 p-4 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total Cart Value</span>
                  <span className="text-lg font-bold text-emerald-600">
                    ${user.cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-sm text-gray-600">No items in cart</p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end rounded-b-xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeMenu, setActiveMenu] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const [restoreModal, setRestoreModal] = useState({ isOpen: false, user: null });
  const [viewModal, setViewModal] = useState({ isOpen: false, user: null });
  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, statusFilter, roleFilter, customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersData();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const openRestoreModal = (user) => {
    setRestoreModal({ isOpen: true, user });
  };

  const closeRestoreModal = () => {
    setRestoreModal({ isOpen: false, user: null });
  };

  const openViewModal = (user) => {
    setViewModal({ isOpen: true, user });
  };

  const closeViewModal = () => {
    setViewModal({ isOpen: false, user: null });
  };

  const handleDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      await softDeleteUserData(deleteModal.user._id);
      toast.success('User disabled successfully');
      await fetchCustomers();
      closeDeleteModal();
    } catch (error) {
      toast.error('Failed to disable user. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestoreUser = async () => {
    try {
      setRestoreLoading(true);
      await restoreUserData(restoreModal.user._id);
      toast.success('User restored successfully');
      await fetchCustomers();
      closeRestoreModal();
    } catch (error) {
      console.error('Error restoring user:', error);
      toast.error('Failed to restore user. Please try again.');
    } finally {
      setRestoreLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = [...customers];

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => {
        if (statusFilter === 'active') return customer.isActive && !customer.isDeleted;
        if (statusFilter === 'inactive') return !customer.isActive;
        if (statusFilter === 'deleted') return customer.isDeleted;
        return true;
      });
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(customer => customer.role === roleFilter);
    }

    setFilteredCustomers(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (customer) => {
    if (customer.isDeleted) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Deleted</span>;
    }
    if (customer.isActive) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>;
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      user: 'bg-blue-100 text-blue-800',
      moderator: 'bg-orange-100 text-orange-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[role] || colors.user}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const stats = [
    {
      label: 'Total Customers',
      value: customers.length,
      icon: UserCheck,
      color: 'bg-blue-500'
    },
    {
      label: 'Active Users',
      value: customers.filter(c => c.isActive && !c.isDeleted).length,
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      label: 'Inactive Users',
      value: customers.filter(c => !c.isActive).length,
      icon: UserX,
      color: 'bg-orange-500'
    },
    {
      label: 'Deleted Users',
      value: customers.filter(c => c.isDeleted).length,
      icon: Trash2,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteUser}
        title="Disable User Account"
        message={`Are you sure you want to disable ${deleteModal.user?.name}'s account? This user will no longer be able to access the system.`}
        type="delete"
        loading={deleteLoading}
      />

      <ConfirmationModal
        isOpen={restoreModal.isOpen}
        onClose={closeRestoreModal}
        onConfirm={handleRestoreUser}
        title="Restore User Account"
        message={`Are you sure you want to restore ${restoreModal.user?.name}'s account? This user will regain access to the system.`}
        type="restore"
        loading={restoreLoading}
      />

      <UserDetailsModal
        isOpen={viewModal.isOpen}
        onClose={closeViewModal}
        user={viewModal.user}
      />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600 mt-1">Manage and view all customer accounts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchCustomers}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <UserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No customers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cart Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold text-sm flex-shrink-0">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">{customer.name}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(customer.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(customer)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-800 font-medium">
                        {customer.cart.length} items
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(customer.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openViewModal(customer)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-1 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>

                        {/* <button disabled={true}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors flex items-center space-x-1 text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button> */}

                        {customer.isDeleted ? (
                          <button
                            onClick={() => openRestoreModal(customer)}
                            className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center space-x-1 text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Enable</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => openDeleteModal(customer)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-1 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Disable</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && filteredCustomers.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      )}
    </div>
  );
}