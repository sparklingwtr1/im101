import React, { useState, useEffect } from 'react';
import Header from '../main/header';

function Dashboard() {
  const storedEmail = localStorage.getItem('userEmail');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // To switch between Dashboard, Settings, and Orders
  const [orders, setOrders] = useState([]); // State for storing customer orders

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://sparklingwater1.helioho.st/getUser.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: storedEmail }), // Send stored email to API
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.username) {
          setUsername(data.username);
        } else {
          setError(data.message || 'Error: User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data.');
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch('https://sparklingwater1.helioho.st/getOrders.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: storedEmail }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const orderData = await response.json();
        setOrders(orderData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders.');
      }
    };

    if (storedEmail) {
      fetchUserData();
      if (activeTab === 'orders') {
        fetchOrders();
      }
    }
  }, [storedEmail, activeTab]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    console.log('Image uploaded', profileImage);
  };

  return (
    <>
      <Header />
      <div className="dashboard-container flex h-screen w-full bg-gradient-to-r from-blue-100 to-blue-200 shadow-lg rounded-lg">
        
        {/* Sidebar */}
        <div className="w-1/5 flex flex-col items-center space-y-6 p-4 bg-white shadow-lg rounded-lg">
          
          {/* Profile Image */}
          <div className="relative">
            <img
              src={previewImage || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* User Info */}
          <div className="text-center">
            {storedEmail ? (
              <div>
                <p className="text-lg font-bold">Email: {storedEmail}</p>
                <p className="text-lg font-bold">Username: {username || 'Loading...'}</p>
              </div>
            ) : (
              <p className="text-lg">No user is logged in</p>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </div>

          {/* Sidebar Buttons */}
          <div className="flex flex-col space-y-4 w-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-4 w-full text-left rounded-lg shadow-lg ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-4 w-full text-left rounded-lg shadow-lg ${
                activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-4 w-full text-left rounded-lg shadow-lg ${
                activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              Orders
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-4/5 p-8">
          {activeTab === 'dashboard' && (
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-center mb-6">Welcome to Your Dashboard</h2>
              <p className="text-center">Here you can view your profile and account information.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-form max-w-lg mx-auto">
              <h2 className="text-3xl font-bold text-center mb-6">Settings</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => alert('Settings saved!')}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-3xl font-bold text-center mb-6">Your Orders</h2>
              <ul>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <li key={index} className="bg-gray-200 p-4 rounded-lg mb-4 shadow-lg">
                      <p><strong>Order ID:</strong> {order.id}</p>
                      <p><strong>Date:</strong> {order.date}</p>
                      <p><strong>Total:</strong> ${order.total}</p>
                    </li>
                  ))
                ) : (
                  <p className="text-center">You have no orders yet.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
