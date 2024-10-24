// OrderManagement.js
import React, { useState } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    { id: 1, customer: 'John Doe', total: 500, status: 'Pending' },
    { id: 2, customer: 'Jane Doe', total: 300, status: 'Completed' },
  ]);

  return (
    <div>
      <h2 className="text-xl mb-4">Manage Orders</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border px-4 py-2">{order.id}</td>
              <td className="border px-4 py-2">{order.customer}</td>
              <td className="border px-4 py-2">₱{order.total}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">
                <button className="bg-green-500 text-white px-2 py-1 rounded-lg">Update Status</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
