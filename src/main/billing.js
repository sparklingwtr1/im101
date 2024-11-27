import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Billing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { total = 0, order = {} } = location.state || {}; // Destructure total and order from location state

  const [userData, setUserData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    items: order.items || [], // Set items from order state or default to an empty array
  });
  const [error, setError] = useState(null);

  // Retrieve email from local storage
  const storedEmail = localStorage.getItem('userEmail'); 

  // Fetch user details from the backend
  const fetchUserData = useCallback(async () => {
    if (storedEmail) {
      try {
        const response = await fetch('http://sparklingwater1.helioho.st/getUserDetails.php', {
          method: 'POST',
          headers: {  
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: storedEmail }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.username) {
          setUserData({
            email: data.email,
            username: data.username,
            firstName: data.first_name,
            lastName: data.last_name,
            phoneNumber: data.phone_number,
            address: data.address,
            items: order.items || [],
          });
          setError(null);
        } else {
          setError(data.message || 'No user found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data.');
      }
    } else {
      setError('No email found in local storage.');
    }
  }, [storedEmail, order.items]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleProceedToPayment = () => {
    // Store billing details in local storage for persistence
    localStorage.setItem('billingDetails', JSON.stringify(userData));

    // Redirect to payment page with order details and total
    navigate('/payment', {
      state: {
        order: userData,
        total: total, // Pass total properly here
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Billing Details</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Order Total: ₱{total.toFixed(2)}</h2>

        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-700 font-bold">Username:</p>
              <p>{userData.username}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-bold">First Name:</p>
              <p>{userData.firstName}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-bold">Last Name:</p>
              <p>{userData.lastName}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-bold">Email:</p>
              <p>{userData.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-bold">Address:</p>
              <p>{userData.address}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-bold">Phone Number:</p>
              <p>{userData.phoneNumber}</p>
            </div>
          </>
        )}

        <button
          onClick={handleProceedToPayment}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
          disabled={!!error} // Disable button if there's an error
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Billing;
