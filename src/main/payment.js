import React, { useState,  useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const paypalRef = useRef(); // Ref for PayPal buttons container

  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [showPayPalButtons, setShowPayPalButtons] = useState(false); // State to control PayPal buttons visibility
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  

  // Extract order and total from location state
  const { order = {}, total = 0 } = location.state || {};
  const { items = [], customerId, firstName, lastName, email, address, phoneNumber } = order;

  // Function to dynamically load the PayPal SDK script
  const loadPayPalScript = (callback) => {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AZpLbKyN3DoxxfWX9bgMXL2e23M0gktvJ_WTrD8h0DztGmN8OOv6GoAsSjIdLwtRBmQdZkLvs-Id_kkB'; // PayPal Client ID
    script.onload = () => callback();
    document.body.appendChild(script);
  };



  
  // Initialize PayPal Buttons
  const initializePayPalButtons = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        // Set up the transaction
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toFixed(2), // Total amount
              },
            }],
          });
        },
        // Finalize the transaction
        onApprove: async (data, actions) => {
          try {
            const order = await actions.order.capture();
            console.log('PayPal Order:', order);
            setIsPaid(true);
            setPending(false);
            alert('Payment successful! Redirecting...');
            // Assuming you handle your order creation here (e.g., in your backend)
             // Replace this with your actual order creation logic
          } catch (error) {
            console.error('Error capturing PayPal order:', error);
            setError('Payment failed during order capture.');
            setPending(false);
          }
        },
        // Handle payment errors
        onError: (err) => {
          console.error('PayPal Checkout Error:', err);
          setError('An error occurred with PayPal checkout.');
          setPending(false);
        },
      }).render(paypalRef.current);
    }
  };

  // Handle confirmation of payment
  const handleConfirmPayment = async () => {
    if (paymentMethod === 'PayPal') {
      setShowPayPalButtons(true);
      setPending(true);
      loadPayPalScript(initializePayPalButtons);
    } else {
      const payment = {
        customerId,
        orderdetails: {
          items: items.map(item => ({
            item_name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        totalAmount: total,
        billing: { firstName, lastName, email, address, phoneNumber },
        paymentMethod,
      };

      console.log('Payment Data:', payment); // Debugging line

      // Send payment data to the backend API
      try {
        const response = await fetch('http://localhost/payment.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payment),
        });
        
        // Log the raw response for debugging
        console.log('Raw response:', response);
        
        // Check if the response is JSON before parsing
        const result = await response.json();
        
        if (result.success) {
          alert('Payment successful!');
          navigate('/thanks');
        } else {
          alert('Payment failed: ' + result.message);
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        alert('Error processing payment');
      }
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
        <p><strong>Phone Number:</strong> {phoneNumber}</p>
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
          className="w-full p-2 border border-gray-300 rounded-lg mb-3"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option>Cash on Delivery</option>
          <option>PayPal</option> {/* New PayPal option added */}
        </select>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
          onClick={handleConfirmPayment}
        >
          Confirm Payment
        </button>

        {/* PayPal Buttons Container */}
        {showPayPalButtons && (
          <div ref={paypalRef} className="mt-4"></div>
        )}

        {pending && <p className="text-blue-500">Processing your payment...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default Payment;
