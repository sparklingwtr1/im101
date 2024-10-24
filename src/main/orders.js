import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function OrdersDrawer({ isOpen, orders, onClose, setOrder, total, setTotal }) {
  const navigate = useNavigate();

  // Remove an item from the order
  const removeFromOrder = (id) => {
    const updatedOrder = orders.filter((item) => item.id !== id);
    const itemToRemove = orders.find((item) => item.id === id);
    if (itemToRemove) {
      setOrder(updatedOrder);
      setTotal((prevTotal) => prevTotal - parseFloat(itemToRemove.price) * itemToRemove.quantity);
    }
  };

  // Decrease the quantity of an item
  const decreaseQuantity = (id) => {
    const updatedOrder = orders.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    const item = orders.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      setOrder(updatedOrder);
      setTotal((prevTotal) => prevTotal - parseFloat(item.price));
    }
  };

  // Increase the quantity of an item
  const increaseQuantity = (id) => {
    const updatedOrder = orders.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    const item = orders.find((item) => item.id === id);
    if (item) {
      setOrder(updatedOrder);
      setTotal((prevTotal) => prevTotal + parseFloat(item.price));
    }
  };

  // Complete the order
  const handleCompleteOrder = () => {
    if (orders.length === 0) {
      alert('Your order is empty! Please add items to your order before completing it.');
    } else {
      navigate('/billing', { state: { order: { items: orders }, total } });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-30 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 right-0 h-full w-1/4 bg-gray-100 shadow-md flex flex-col justify-between transition-transform transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          {orders.length === 0 ? (
            <p className="text-gray-600">No items in order</p>
          ) : (
            <ul className="list-disc pl-5 overflow-y-auto max-h-80">
              {orders.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-2">
                  <div>
                    <span className="text-lg font-semibold">{item.name}</span>
                    <span className="text-gray-500">
                      {' '}
                      (₱{parseFloat(item.price).toFixed(2)} x {item.quantity})
                    </span>
                    <span className="text-gray-600">
                      {' '}
                      = ₱{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600"
                    >
                      -
                    </button>
                    <span className="text-gray-600">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromOrder(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <h3 className="text-xl font-semibold mt-6">
            Total: ₱{typeof total === 'number' ? total.toFixed(2) : '0.00'}
          </h3>
        </div>
        <div className="p-6">
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            onClick={handleCompleteOrder}
          >
            Complete Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrdersDrawer;
