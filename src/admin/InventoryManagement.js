import React, { useState, useEffect } from 'react';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });

  // Load inventory from localStorage on component mount
  useEffect(() => {
    const storedInventory = JSON.parse(localStorage.getItem('inventory')) || [];
    setInventory(storedInventory);
  }, []);

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    setNewItem({ name: '', quantity: '' });
  };

  const handleDeleteItem = (index) => {
    const updatedInventory = inventory.filter((_, i) => i !== index);
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Inventory Management</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Item name"
          value={newItem.name}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <button onClick={handleAddItem} className="bg-green-500 text-white py-2 px-4 rounded">
          Add Item
        </button>

        <ul className="mt-4 space-y-2">
          {inventory.map((item, index) => (
            <li key={index} className="border p-2 rounded flex justify-between">
              {item.name} - Quantity: {item.quantity}
              <button
                onClick={() => handleDeleteItem(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryManagement;
