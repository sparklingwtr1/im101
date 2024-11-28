import React, { useState, useEffect } from 'react';
import OrdersDrawer from './orders';
import Header from '../main/header';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrder] = useState([]);
  const [total, setTotal] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('https://sparklingwater1.helioho.st/getMenuItems.php');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const calculatedTotal = orders.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(calculatedTotal);
  }, [orders]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const addToOrder = (menuItem) => {
    if (!isUserLoggedIn()) {
      setShowPrompt(true);
      return;
    }

    const existingItemIndex = orders.findIndex((item) => item.id === menuItem.menu_id);

    if (existingItemIndex !== -1) {
      const updatedOrders = orders.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setOrder(updatedOrders);
    } else {
      setOrder([...orders, { ...menuItem, id: menuItem.menu_id, quantity: 1 }]);
    }
  };

  const isUserLoggedIn = () => {
    return localStorage.getItem('userEmail') !== null;
  };

  const getTotalQuantity = () => {
    return orders.reduce((sum, item) => sum + item.quantity, 0);
  };

  const closePrompt = () => {
    setShowPrompt(false);
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      <Header onClick={toggleSidebar} />
      <div className="p-6 bg-gray-100 min-h-screen">
        {Object.keys(groupedMenuItems).map((category) => (
          <div key={category} className="mb-10">
            <h2 className="text-3xl font-bold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {groupedMenuItems[category].map((menuItem) => (
                <div
                  key={menuItem.menu_id}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 hover:rotate-2 transform transition-all duration-300 ease-in-out opacity-90 hover:opacity-100 z-10"
                >
                  <img
                    src={`data:image/jpeg;base64,${menuItem.image}`}
                    alt={menuItem.name}
                    className="h-48 w-full object-cover transition-opacity duration-300 ease-in-out opacity-100"
                  />
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-800">{menuItem.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">₱{menuItem.price}</p>
                    <button
                      onClick={() => addToOrder(menuItem)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mt-4 rounded-md w-full transition duration-300"
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-lg transition duration-300"
        onClick={toggleSidebar}
      >
        View Orders
        {getTotalQuantity() > 0 && (
          <span className="absolute top-[-5px] right-[-5px] bg-red-500 text-white text-sm rounded-full px-2">
            {getTotalQuantity()}
          </span>
        )}
      </button>

      <OrdersDrawer
        isOpen={sidebarVisible}
        orders={orders}
        onClose={toggleSidebar}
        setOrder={setOrder}
        total={total}
        setTotal={setTotal}
      />

      {showPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg">
            <p className="mb-4 text-gray-700">Cannot add to order. Please log-in first.</p>
            <button
              onClick={closePrompt}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Menu;
