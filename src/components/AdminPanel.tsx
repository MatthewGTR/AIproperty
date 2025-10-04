import React, { useState, useEffect } from 'react';
import { X, Users, CreditCard, CheckCircle, XCircle, Plus, Minus, Search, Filter, Calendar } from 'lucide-react';
import { authService } from '../services/authService';
import { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type CreditTransaction = Database['public']['Tables']['credit_transactions']['Row'];

interface AdminPanelProps {
  onClose: () => void;
  currentUser: { id: string; name: string; email: string; userType: string; credits: number };
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'credits'>('pending');
  const [pendingRegistrations, setPendingRegistrations] = useState<Profile[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pending, allUsers, transactions] = await Promise.all([
        authService.getPendingRegistrations(),
        authService.getAllUsers(),
        authService.getCreditTransactions()
      ]);
      
      setPendingRegistrations(pending);
      setUsers(allUsers);
      setCreditTransactions(transactions);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleApproveRegistration = async (registrationId: string) => {
    try {
      const result = await authService.approveRegistration(registrationId, currentUser.id);
      if (result.success) {
        loadData();
        alert('Registration approved successfully!');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to approve registration');
    }
  };

  const handleRejectRegistration = async (registrationId: string) => {
    if (confirm('Are you sure you want to reject this registration?')) {
      try {
        const result = await authService.rejectRegistration(registrationId, currentUser.id);
        if (result.success) {
          loadData();
          alert('Registration rejected');
        }
      } catch (error) {
        alert('Failed to reject registration');
      }
    }
  };

  const handleAddCredits = async () => {
    if (!selectedUser || !creditAmount || !creditReason) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseInt(creditAmount);
    if (amount <= 0) {
      alert('Credit amount must be positive');
      return;
    }

    try {
      const result = await authService.addCredits(selectedUser.id, amount, creditReason, currentUser.id);
      if (result.success) {
        loadData();
        setCreditAmount('');
        setCreditReason('');
        setSelectedUser(null);
        alert(`${amount} credits added to ${selectedUser.full_name}`);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to add credits');
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: Profile['status']) => {
    try {
      const result = await authService.updateUserStatus(userId, status, currentUser.id);
      if (result.success) {
        loadData();
        alert(`User status updated to ${status}`);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  if (currentUser.userType !== 'admin') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have admin privileges.</p>
          <button onClick={onClose} className="w-full bg-blue-600 text-white py-3 rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage users, registrations, and credits</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Registrations ({pendingRegistrations.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'credits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Credit Management
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Pending Registrations Tab */}
        {activeTab === 'pending' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Registrations</h2>
            
            {pendingRegistrations.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No pending registrations</h3>
                <p className="text-gray-600">All registrations have been processed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingRegistrations.map((registration) => (
                  <div key={registration.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{registration.full_name}</h3>
                        <p className="text-blue-600 font-medium capitalize">{registration.user_type}</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        Pending
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><strong>Email:</strong> {registration.email}</p>
                      <p><strong>Phone:</strong> {registration.phone}</p>
                      {registration.company && <p><strong>Company:</strong> {registration.company}</p>}
                      {registration.license_number && <p><strong>License:</strong> {registration.license_number}</p>}
                      <p><strong>Registered:</strong> {new Date(registration.created_at).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApproveRegistration(registration.id)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRegistration(registration.id)}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Users</h2>
            
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize text-sm text-gray-900">{user.user_type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'approved' ? 'bg-green-100 text-green-800' :
                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            user.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.credits}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {user.user_type === 'agent' && (
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Add Credits
                            </button>
                          )}
                          {user.status === 'approved' && (
                            <button
                              onClick={() => handleUpdateUserStatus(user.id, 'suspended')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Suspend
                            </button>
                          )}
                          {user.status === 'suspended' && (
                            <button
                              onClick={() => handleUpdateUserStatus(user.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Reactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Credit Management Tab */}
        {activeTab === 'credits' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Credit Management</h2>
            
            {/* Credit Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Total Credits Issued</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {creditTransactions
                        .filter(t => t.transaction_type === 'addition')
                        .reduce((sum, t) => sum + t.amount, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Active Agents</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {users.filter(u => u.user_type === 'agent' && u.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">This Month</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {creditTransactions
                        .filter(t => new Date(t.created_at).getMonth() === new Date().getMonth())
                        .length}
                    </p>
                    <p className="text-sm text-purple-600">Transactions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Add Credits */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Credits to Agent</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={selectedUser?.id || ''}
                  onChange={(e) => {
                    const user = users.find(u => u.id === e.target.value);
                    setSelectedUser(user || null);
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Agent</option>
                  {users
                    .filter(u => u.user_type === 'agent' && u.status === 'approved')
                    .map(user => (
                      <option key={user.id} value={user.id}>
                        {user.full_name} ({user.credits} credits)
                      </option>
                    ))}
                </select>
                
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="Credit amount"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                
                <input
                  type="text"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  placeholder="Reason for credit"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                
                <button
                  onClick={handleAddCredits}
                  disabled={!selectedUser || !creditAmount || !creditReason}
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Credits
                </button>
              </div>
            </div>

            {/* Credit Transactions */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Credit Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {creditTransactions
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .slice(0, 20)
                      .map((transaction) => {
                        const user = users.find(u => u.id === transaction.user_id);
                        return (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user?.full_name || 'Unknown'}</div>
                              <div className="text-sm text-gray-500">{user?.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                transaction.transaction_type === 'addition' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.transaction_type === 'addition' ? '+' : '-'}{transaction.amount}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;