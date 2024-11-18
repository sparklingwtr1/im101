import React, { useEffect, useState, useRef, useCallback } from 'react';

const OrdersDash = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all'); // New state for filter (all, completed, pending)
  const ordersContainerRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  // Memoize fetchOrders using useCallback to prevent it from changing on each render
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        throw new Error('No email found in local storage');
      }
  
      const response = await fetch('http://localhost/getOrders.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, filter, page }), // Pass filter along with email and page
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
  
      const data = await response.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setOrders((prevOrders) => [...prevOrders, ...data]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [filter]); // Add filter to dependencies so it updates when changed
  

  useEffect(() => {
    fetchOrders(); // Fetch initial orders when the component mounts or when page or filter changes
  }, [filter, fetchOrders]);

  // Scroll handling logic
  useEffect(() => {
    const handleScroll = () => {
      if (ordersContainerRef.current) {
        const bottom = ordersContainerRef.current.scrollHeight === ordersContainerRef.current.scrollTop + ordersContainerRef.current.clientHeight;
        if (bottom && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    const container = ordersContainerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

  // Handle filter button clicks
  const handleFilterClick = (status) => {
    setFilter(status); // Update the filter state to show completed or pending orders
    setPage(1); // Reset to page 1 when changing the filter
    setOrders([]); // Clear the current orders to reload filtered ones
    setHasMore(true); // Reset hasMore to true for the new filter
  };

  return (
    <div className="orders-dashboard-container p-8">
      <h2 className="text-3xl font-bold text-center mb-6">Your Orders</h2>

      {/* Filter buttons */}
      <div className="text-center mb-4">
        <button
          onClick={() => handleFilterClick('completed')}
          className={`py-2 px-4 mr-4 rounded-lg ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Completed
        </button>
        <button
          onClick={() => handleFilterClick('pending')}
          className={`py-2 px-4 rounded-lg ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Pending
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading orders...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div
        ref={ordersContainerRef}
        className="overflow-y-auto"
        style={{ maxHeight: '70vh' }}
      >
        {!loading && !error && orders.length === 0 && (
          <p className="text-center text-gray-500">No orders found.</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {orders.map((order) => (
              <div key={order.order_id} className="border p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Order ID: {order.order_id}</h3>
                <p>Customer ID: {order.customer_id}</p>
                <p>Total Price: ${order.total_price}</p>
                <p>Order Date: {order.order_date}</p>
                <p>Billing Date: {order.billing_date}</p>
                <p>Payment Method: {order.payment_method}</p>
                <p>Item: {order.item_name}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Status: {order.status}</p>
                <button
                  className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                  onClick={() => alert(`View details of Order ID: ${order.order_id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="text-center mt-4">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersDash;
