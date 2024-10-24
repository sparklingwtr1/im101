import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Billing() {
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure location.state exists to avoid errors
  const { total = 0, order = {} } = location.state || {};

  // Handle case where items may be undefined or empty
  const orders = order.items || [];

  // Set up formData using the order details if available
  const [formData, setFormData] = useState({
    firstName: order.firstName || '',
    lastName: order.lastName || '',
    email: order.email || '',
    confirmEmail: order.email || '', // Pre-fill confirmEmail to match email
    address: order.address || '',
    number: order.number || '',
    items: orders, // Set items from order
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if email and confirmEmail match
    if (formData.email !== formData.confirmEmail) {
      alert('Email and Confirm Email do not match!');
      return;
    }

    // Store billing details and ordered items in local storage
    localStorage.setItem('billingDetails', JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      address: formData.address,
      number: formData.number,
      items: orders,
    }));

    // Redirect to the payment page and pass the form data and total
    navigate('/payment', {
      state: {
        order: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          number: formData.number,
          items: orders, // Ensure the items are passed properly
        },
        total: total, // Pass total properly
      },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Billing Details</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Order Total: ₱{total}</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Confirm Email</label>
            <input
              type="email"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
            {formData.email !== formData.confirmEmail && (
              <p className="text-red-500 text-sm mt-1">Emails must match.</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
}

export default Billing;
