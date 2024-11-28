import React, { useState, useEffect } from 'react';
import Header from '../main/header';
import OrderD from '../users/ordersDash'; // Import your OrdersDash component
import { firestore } from '../firebase/firebaseConfig'; // Import Firestore configuration
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions

function Dashboard() {
  const storedEmail = localStorage.getItem('userEmail');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // To switch between Dashboard, Settings, and Orders

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

    if (storedEmail) {
      fetchUserData();
    }
  }, [storedEmail]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Preview image
    }
  };

  // Convert the image to Base64 and upload to Firestore
  const handleImageUpload = async () => {
    if (!profileImage) {
      setError('Please select an image first.');
      return;
    }

    // Convert the image to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1]; // Get Base64 part after the comma

      try {
        // Upload Base64 image to Firestore under the user's profile
        const userRef = doc(firestore, 'users', storedEmail);
        await setDoc(userRef, { profileImage: base64Image }, { merge: true });

        setError(null); // Reset any previous error
        alert('Profile image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image to Firestore:', error);
        setError('Failed to upload image.');
      }
    };
    reader.readAsDataURL(profileImage); // Read the file as Base64
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
            <div className="mb-6 bg-white shadow-lg rounded-lg p-6">
              {/* Welcome Header */}
              <div className="flex flex-col items-center mb-4">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Your Dashboard</h2>
                <p className="text-lg text-gray-600">Here you can view and manage your profile and account information.</p>
              </div>

              {/* Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {/* Card 1 */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold mb-2">Profile Information</h3>
                  <p className="text-sm">Update your profile details and preferences.</p>
                  <button
                    className="mt-4 bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-100"
                    onClick={handleImageUpload}
                  >
                    Upload Profile Image
                  </button>
                </div>

                {/* Card 2 */}
                <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold mb-2">Orders Overview</h3>
                  <p className="text-sm">Check your order history and details.</p>
                  <button className="mt-4 bg-white text-green-600 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-100">
                    View Orders
                  </button>
                </div>

                {/* Card 3 */}  
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold mb-2">Statistics</h3>
                  <p className="text-sm">View your performance and activity stats.</p>
                  <button className="mt-4 bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-100">
                    View Stats
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && <OrderD />} {/* Show the OrdersDash component here */}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
