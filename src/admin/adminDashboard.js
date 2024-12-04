import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuManagement from '../admin/MenuManagement';
import OrderManagement from '../admin/OrderManagement';
import EmployeeManagement from '../admin/EmployeeManagement';

import SalesReportManagement from '../admin/SalesReportManagement'; // Import the new Sales Report Management component

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('menu'); // Default active tab
  const [loading, setLoading] = useState(false);  // Added loading state
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);  // Start loading state
    try {
      // Simulate a delay for logout process (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      localStorage.removeItem('adminEmail');
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);  // Reset loading state after logout
    }
  };
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-800 text-white p-6">
        <div className="text-2xl font-bold mb-8">Admin Dashboard</div>
        <ul>
          <li
            className={`cursor-pointer py-2 ${activeTab === 'menu' ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            Menu Management
          </li>
          <li
            className={`cursor-pointer py-2 ${activeTab === 'orders' ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Order Management
          </li>
          
          <li
            className={`cursor-pointer py-2 ${activeTab === 'employees' ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            Employee Management
          </li>
          <li
            className={`cursor-pointer py-2 ${activeTab === 'sales' ? 'bg-gray-600' : ''}`} // Sales Report Management tab
            onClick={() => setActiveTab('sales')}
          >
            Sales Report Management
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg w-full"
        >
          {loading ? (
                              <div className="flex justify-center items-center space-x-2">
                                <div className="w-5 h-5 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                                <span>Logging out...</span>
                              </div>
                            ) : (
                              <span>Logout</span>
                            )}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {activeTab === 'menu' 
              ? 'Manage Menu' 
              : activeTab === 'orders' 
              ? 'Manage Orders' 
              
              : activeTab === 'employees' 
              ? 'Manage Employees' 
 
              : 'Manage Sales Reports' // Add title for Inventory and Sales Report Management
            }
          </h1>
          <div>
            <span className="font-semibold">Admin:</span> <span>{localStorage.getItem('adminEmail')}</span>
          </div>
        </div>

        {/* Conditional rendering based on selected tab */}
        {activeTab === 'menu' && <MenuManagement />}
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'sales' && <SalesReportManagement />} {/* Render Sales Report Management component */}
      </main>
    </div>
  );
};

export default AdminDashboard;
