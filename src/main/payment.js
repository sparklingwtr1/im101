import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // Extract order and total from location state
  const { order = {}, total = 0 } = location.state || {};
  const { items = [], customerId, firstName, lastName, email, address, number } = order;

  const handleConfirmPayment = async () => {
    // Prepare the data to be sent to the backend
    const paymentData = {
      customerId: customerId, // Make sure this exists in order data
      orderDetails: { 
        items, 
      },
      totalAmount: total, // Send total amount directly
      billingDetails: { firstName, lastName, email, address, number },
      paymentMethod, // The payment method selected by the user
    };

    console.log('Payment Data:', paymentData); // Debugging line

    // Send payment data to the backend API
    try {
      const response = await fetch('http://localhost/payment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      if (result.success) {
        alert('Payment successful!');

        // Redirect to a success page or dashboard
        navigate('/thank-you');
      } else {
        alert('Payment failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Payment Page</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <p><strong>Name:</strong> {firstName} {lastName}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>Phone Number:</strong> {number}</p>
        <p><strong>Order Total:</strong> ₱{total.toFixed(2)}</p>

        <h3 className="text-lg font-bold mt-4">Ordered Items:</h3>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.quantity} x ₱{parseFloat(item.price).toFixed(2)}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-bold mt-4">Choose Payment Method</h3>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option>Cash on Delivery</option>
          <option>Online Payment</option>
        </select>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
          onClick={handleConfirmPayment}
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
}

export default Payment;
