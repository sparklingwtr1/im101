import React, { useState, useEffect } from 'react'; 
import OrdersDrawer from './orders';
import Header from '../main/header';

function Menu() {
  const [menuItems, setMenuItems] = useState([]); // State to hold menu items
  const [orders, setOrder] = useState([]);
  const [total, setTotal] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false); // State to manage prompt visibility

  // Function to fetch menu items from the API
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost/getMenuItems.php'); // Update URL as needed
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems(); // Fetch menu items when the component mounts
  }, []);

  useEffect(() => {
    // Calculate total whenever orders change
    const calculatedTotal = orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(calculatedTotal);
  }, [orders]); // Run this effect when orders changes

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const addToOrder = (menuItem) => {
    // Check if the user is logged in
    if (!isUserLoggedIn()) {
      setShowPrompt(true); // Show prompt if user is not logged in
      return; // Exit early, do not proceed with adding to order
    }
  
    // Check if the item already exists in the order
    const existingItemIndex = orders.findIndex((item) => item.id === menuItem.menu_id);
  
    if (existingItemIndex !== -1) {
      // If it exists, increase the quantity
      const updatedOrders = orders.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 } // Update only the matched item
          : item
      );
      setOrder(updatedOrders); // Update orders state with new quantity
    } else {
      // If it doesn't exist, add new item with quantity of 1
      setOrder([...orders, { ...menuItem, id: menuItem.menu_id, quantity: 1 }]);
    }
  };
  

  // Check if the user is logged in
  const isUserLoggedIn = () => {
    return localStorage.getItem('userEmail') !== null; // Change from 'customerEmail' to 'userEmail'
  };

  const getTotalQuantity = () => {
    return orders.reduce((sum, item) => sum + item.quantity, 0);
  };

  const closePrompt = () => {
    setShowPrompt(false); // Close the prompt
  };

  return (
    <>
      <Header onClick={toggleSidebar} />
      <div className="grid grid-cols-3 gap-4 p-4">
        {menuItems.map((menuItem) => (
          <div key={menuItem.menu_id} className="border p-4">
            <h3 className="font-semibold text-lg">{menuItem.name}</h3>
            <img src={menuItem.imageUrl} alt={menuItem.name} className="h-32 object-cover" />
            <p className="text-lg">₱{menuItem.price}</p>
            <button 
              onClick={() => addToOrder(menuItem)} 
              className="bg-blue-500 text-white px-2 py-1 rounded-lg mt-2"
            >
              Add to Order
            </button>
          </div>
        ))}
      </div>
      <button
        className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg"
        onClick={toggleSidebar}
      >
        View Orders
        {getTotalQuantity() > 0 && (
          <span className="absolute top-[-15px] right-[px] bg-red-500 text-white text-sm rounded-full px-2 py-1">
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

      {/* Prompt for login */}
      {showPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="mb-4">Cannot add to order. Please log-in first.</p>
            <button 
              onClick={closePrompt} 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
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
