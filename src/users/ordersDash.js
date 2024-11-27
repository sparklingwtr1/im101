import React, { useEffect, useState, useRef, useCallback } from 'react';

const OrdersDash = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const ordersContainerRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order

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
        body: JSON.stringify({ email, filter, page }),
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
  }, [filter, page]);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const handleScroll = () => {
    if (ordersContainerRef.current) {
      const bottom = ordersContainerRef.current.scrollHeight === ordersContainerRef.current.scrollTop + ordersContainerRef.current.clientHeight;
      if (bottom && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const container = ordersContainerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

  const handleFilterClick = (status) => {
    setFilter(status);
    setPage(1);
    setOrders([]);
    setHasMore(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order); // Set the selected order to show in modal
  };

  const closeModal = () => {
    setSelectedOrder(null); // Close modal by setting selectedOrder to null
  };

  return (
    <div className="orders-dashboard-container p-8 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Your Orders</h2>

      {/* Filter buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => handleFilterClick('completed')}
          className={`py-2 px-6 rounded-lg transition-all duration-300 ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white`}
        >
          Completed
        </button>
        <button
          onClick={() => handleFilterClick('pending')}
          className={`py-2 px-6 rounded-lg transition-all duration-300 ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white`}
        >
          Pending
        </button>
        <button
          onClick={() => handleFilterClick('all')}
          className={`py-2 px-6 rounded-lg transition-all duration-300 ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white`}
        >
          All Orders
        </button>
      </div>

      {/* Error & Loading */}
      {loading && <p className="text-center text-gray-500">Loading orders...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div
        ref={ordersContainerRef}
        className="overflow-y-auto max-h-[70vh] mb-6"
        style={{ maxHeight: '70vh' }}
      >
        {!loading && !error && orders.length === 0 && (
          <p className="text-center text-gray-500">No orders found.</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Order ID: {order.order_id}</h3>
                <p className="text-gray-600 mb-4">Status: {order.status}</p>
                <button
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                  onClick={() => handleViewOrder(order)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Order Details */}
      {selectedOrder && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
        <button
          className="text-gray-600 hover:text-gray-800"
          onClick={closeModal}
        >
          ✖
        </button>
      </div>
      <div className="space-y-2 text-gray-600 text-sm">
        <div className="flex justify-between">
          <p><strong>Order ID:</strong></p>
          <p>{selectedOrder.order_id}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Customer ID:</strong></p>
          <p>{selectedOrder.customer_id}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Total Price:</strong></p>
          <p>${selectedOrder.total_price}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Order Date:</strong></p>
          <p>{selectedOrder.order_date}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Billing Date:</strong></p>
          <p>{selectedOrder.billing_date}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Payment Method:</strong></p>
          <p>{selectedOrder.payment_method}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Item:</strong></p>
          <p>{selectedOrder.item_name}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Quantity:</strong></p>
          <p>{selectedOrder.quantity}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Status:</strong></p>
          <p>{selectedOrder.status}</p>
        </div>
      </div>
      <button
        className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        onClick={closeModal}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default OrdersDash;
