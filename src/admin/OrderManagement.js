import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    axios.get('http://localhost/getAdminOrders.php')
      .then(response => setOrders(response.data))
      .catch(error => console.error("There was an error fetching orders:", error));
  }, []);

  const updateStatus = (orderId, newStatus) => {
    axios.post('http://localhost/update_status.php', {
      order_id: orderId,
      status: newStatus,
    })
    .then(response => {
      if (response.data.success) {
        setOrders(orders.map(order => 
          order.order_id === orderId ? { ...order, status: newStatus } : order
        ));
        setSelectedOrder({ ...selectedOrder, status: newStatus });
        setSuccessMessage("Order marked as Completed!");
        setTimeout(() => setSuccessMessage(""), 3000); // Hide message after 3 seconds
      }
    })
    .catch(error => console.error("There was an error updating the status:", error));
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Manage Orders</h2>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {successMessage}
        </div>
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.order_id} onClick={() => viewOrderDetails(order)} className="cursor-pointer">
              <td className="border px-4 py-2">{order.order_id}</td>
              <td className="border px-4 py-2">{order.customer}</td>
              <td className="border px-4 py-2">₱{order.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-2">Order Details for Order ID {selectedOrder.order_id}</h3>
            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Total Price:</strong> ₱{selectedOrder.total_price}</p>
            <p><strong>Payment Method:</strong> {selectedOrder.payment_method}</p>
            <p><strong>Payment Date:</strong> {selectedOrder.payment_date}</p>

            <h4 className="mt-4 font-semibold">Items</h4>
            <table className="min-w-full bg-gray-100 mt-2">
              <thead>
                <tr>
                  <th className="px-4 py-2">Item Name</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{item.item_name}</td>
                    <td className="border px-4 py-2">{item.quantity}</td>
                    <td className="border px-4 py-2">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4 space-x-2">
              {selectedOrder.items.every(item => item.status === 'Completed') ? null : (
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => updateStatus(selectedOrder.order_id, 'Completed')}
                >
                  Mark as Completed
                </button>
              )}
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded-lg" 
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
