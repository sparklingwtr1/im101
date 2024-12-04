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
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        {Object.keys(groupedMenuItems).map((category) => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4 sm:mb-6 border-b-2 border-blue-500 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {groupedMenuItems[category].map((menuItem) => (
                <div
                  key={menuItem.menu_id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                  <img
                    src={`data:image/jpeg;base64,${menuItem.image}`}
                    alt={menuItem.name}
                    className="h-36 sm:h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-800">{menuItem.name}</h3>
                    <p className="text-gray-600 text-sm mt-2">₱{menuItem.price}</p>
                    <button
                      onClick={() => addToOrder(menuItem)}
                      className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm sm:text-base"
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
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-5 py-3 rounded-full shadow-lg transition duration-300 z-50 flex items-center gap-2"
        onClick={toggleSidebar}
      >
        <span className="text-sm sm:text-base">View Orders</span>
        {getTotalQuantity() > 0 && (
          <span className="bg-red-500 text-white text-xs sm:text-sm rounded-full px-2 py-1">
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
          <div className="bg-white p-4 sm:p-6 rounded-lg text-center shadow-lg w-4/5 sm:w-1/3">
            <p className="mb-4 text-gray-700 text-sm sm:text-base">
              Cannot add to order. Please log in first.
            </p>
            <button
              onClick={closePrompt}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 text-sm sm:text-base"
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
