import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Modal from 'react-modal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Set the app element for accessibility
Modal.setAppElement('#root');

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMenuItems = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://sparklingwater1.helioho.st/getMenuItems.php');
                const data = await response.json();
                if (Array.isArray(data)) {
                    // Parse price to number to avoid type issues
                    const parsedData = data.map(item => ({
                        ...item,
                        price: Number(item.price), // Ensure price is a number
                    }));
                    setMenuItems(parsedData);
                } else {
                    console.error('Invalid data format for menu items:', data);
                }
            } catch (error) {
                console.error('Error fetching menu items:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBranches = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost/getBranches.php');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setBranches(data);
                } else {
                    console.error('Invalid data format for branches:', data);
                }
            } catch (error) {
                console.error('Error fetching branches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
        fetchBranches();
    }, []);

    const handleAddItem = async () => {
        // Validate input
        if (!newItemName || isNaN(newItemPrice) || Number(newItemPrice) <= 0 || !selectedBranch) {
            alert('Please enter a valid item name, price (must be greater than 0), and select a branch.');
            return;
        }
    
        const newItemData = {
            name: newItemName,
            price: Number(newItemPrice),
            branch_name: selectedBranch, // Use branch_name instead of branch_id
        };
    
        try {
            const response = await fetch('http://localhost/addMenuItem.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItemData),
            });
    
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Failed to add menu item');
            }
    
            const result = await response.json();
            if (result.status === 'success') {
                setMenuItems(prevItems => [...prevItems, { ...newItemData, id: menuItems.length + 1 }]);
                setModalIsOpen(false);
                setNewItemName('');
                setNewItemPrice('');
                setSelectedBranch('');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error adding menu item:', error);
            alert('Error adding menu item: ' + error.message);
        }
    };
    

        const chartData = {
            labels: menuItems.map(item => item.name),
            datasets: [
                {
                    label: 'Sales',
                    data: menuItems.map(item => item.sales),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    barThickness: 15,
                },
            ],
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: 10,
                        },
                    },
                },
                title: {
                    display: true,
                    text: 'Menu Item Sales',
                    font: {
                        size: 14,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 10,
                        },
                    },
                },
                y: {
                    ticks: {
                        font: {
                            size: 10,
                        },
                    },
                },
            },
        };

        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <h2 className="text-2xl font-semibold mb-6">Manage Menu Items</h2>
    
                <div style={{ height: '400px', width: '100%', marginBottom: '20px' }}>
                    <Bar data={chartData} options={chartOptions} />
                </div>
    
                <button 
                    onClick={() => setModalIsOpen(true)} 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                    Add New Item
                </button>
    
                <Modal 
                    isOpen={modalIsOpen} 
                    onRequestClose={() => setModalIsOpen(false)} 
                    contentLabel="Add New Menu Item"
                    style={{
                        content: {
                            maxHeight: '450px',
                            maxWidth: '400px',
                            margin: 'auto',
                            padding: '20px',
                            borderRadius: '10px',
                        },
                    }}
                >
                    <h2 className="text-xl font-semibold mb-4">Add New Menu Item</h2>
                    <div>
                        <label className="block mb-2 font-medium">Item Name:</label>
                        <input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                            placeholder="Enter item name"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Price:</label>
                        <input
                            type="number"
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(e.target.value)}
                            className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                            placeholder="Enter item price"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Select Branch:</label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                        >
                            <option value="">Select a branch</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={handleAddItem} 
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                    >
                        Add Item
                    </button>
                    <button 
                        onClick={() => setModalIsOpen(false)} 
                        className="bg-red-600 text-white px-4 py-2 rounded-lg ml-2 hover:bg-red-700 transition duration-300"
                    >
                        Cancel
                    </button>
                </Modal>
    
                {loading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Menu Items</h3>
                        <ul className="space-y-2">
                            {menuItems.map(item => (
                                <li key={item.id} className="border border-gray-300 bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-gray-600">${typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

export default MenuManagement;
