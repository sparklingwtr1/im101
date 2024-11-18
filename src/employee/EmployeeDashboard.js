// EmployeeDashboard.js
import React, { useState } from 'react';
import Orders from '../admin/OrderManagement'; // Component for managing orders


const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // Default active tab

  const handleLogout = () => {
    // Clear localStorage or perform any other necessary logout actions
    localStorage.removeItem('employeeName');
    // Optionally redirect to a login page or another route
    window.location.href = '/employee'; // Change this to your actual login route
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-800 text-white p-6">
        <div className="text-2xl font-bold mb-8">Employee Dashboard</div>
        <ul>
          <li
            className={`cursor-pointer py-2 ${activeTab === 'orders' ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Manage Orders
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {activeTab === 'orders' ? 'Manage Orders' : 'Manage Inventory'}
          </h1>
          <div className="flex items-center">
            <span className="font-semibold">Employee:</span> <span>{localStorage.getItem('employeeName')}</span>
            <button
              className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Conditional rendering based on selected tab */}
        {activeTab === 'orders' && <Orders />}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
