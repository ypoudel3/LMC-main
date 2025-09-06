import React, { useState, useEffect } from 'react';
import { PlusCircle, DollarSign, TrendingUp, TrendingDown, Trash2, Edit3 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5001/api';

const Expense = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const token = localStorage.getItem('token'); // If your backend uses JWT

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Backend error fetching transactions:', data);
        return;
      }
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Fetch balance
  const fetchBalance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/balance`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Backend error fetching balance:', data);
        return;
      }
      setBalance(data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.amount || !formData.description || !formData.category) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const url = editingTransaction 
        ? `${API_BASE_URL}/transactions/${editingTransaction._id}`
        : `${API_BASE_URL}/transactions`;

      const method = editingTransaction ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Backend error:', data);
        alert(data.message || 'Failed to save transaction');
        return;
      }

      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      setEditingTransaction(null);
      fetchTransactions();
      fetchBalance();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Backend error deleting transaction:', data);
        alert(data.message || 'Failed to delete transaction');
        return;
      }
      fetchTransactions();
      fetchBalance();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  // Handle edit
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description,
      category: transaction.category,
      date: new Date(transaction.date).toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
    <div className="fixed top-0 z-50 w-full flex flex-row justify-between pt-3 pb-3 px-7 md:px-12 bg-black/90 brightness-90">
          <div className="text-white flex flex-row items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            <div>L-MCM</div>
          </div>


          <div className="flex justify-center">
            <ul className="flex gap-6 text-white">
        <a href="/app" target="_self">Home</a>
        <a href="/legal" target="_self">Legal Help</a>
          <a href="/expense" target="_self">Track Expenses</a>
          <a href="/reportform" target="_self">Report Abuse</a>            </ul>
          </div>

          <div className="text-white">
            <i
              className="fa-regular fa-user cursor-pointer"
              onClick={() => setIsOpen(true)}
            ></i>
          </div>
        </div>
          <div className="text-white">
            <i
              className="fa-regular fa-user cursor-pointer"
              onClick={() => setIsOpen(true)}
            ></i>
          </div>
        
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">💰 Expense Tracker</h1>
          <p className="text-gray-600">Log your earnings, spending, and balance anytime</p>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(balance.totalIncome)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(balance.totalExpense)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Balance</p>
                <p className={`text-2xl font-bold ${balance.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(balance.balance)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Add Transaction Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => {
              setShowForm(true);
              setEditingTransaction(null);
              setFormData({
                type: 'expense',
                amount: '',
                description: '',
                category: '',
                date: new Date().toISOString().split('T')[0]
              });
            }}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Transaction
          </button>
        </div>

        {/* Transaction Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingTransaction ? 'Update' : 'Add'} Transaction
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingTransaction(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No transactions yet. Add your first transaction to get started!</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <p className="font-medium text-gray-800">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.category} • {formatDate(transaction.date)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                      <div className="flex space-x-1">
                        <button onClick={() => handleEdit(transaction)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(transaction._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Expense;
