// ../admin/OrderManagement.js
import React, { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost/getAdminOrders.php') // Adjust this URL as needed
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2">Customer ID</th>
            <th className="px-4 py-2">Total Price</th>
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Item Name</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Payment Method</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{order.customer_id}</td>
              <td className="px-4 py-2">{order.total_price}</td>
              <td className="px-4 py-2">{order.order_id}</td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2">{order.item_name}</td>
              <td className="px-4 py-2">{order.quantity}</td>
              <td className="px-4 py-2">{order.payment_method}</td>
              <td className="px-4 py-2">{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
