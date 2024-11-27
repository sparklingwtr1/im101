import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [branchModalIsOpen, setBranchModalIsOpen] = useState(false); // New state for branch modal
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [newItemImage, setNewItemImage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newBranchName, setNewBranchName] = useState(''); // State for new branch name
    const [newBranchAddress, setNewBranchAddress] = useState(''); // State for new branch address
    const [newBranchCity, setNewBranchCity] = useState(''); // State for new branch city
    const [newBranchPhone, setNewBranchPhone] = useState(''); // State for new branch phone number

    useEffect(() => {
        const fetchMenuItems = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://sparklingwater1.helioho.st/getMenuItems.php');
                const data = await response.json();
                setMenuItems(data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBranches = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://sparklingwater1.helioho.st/getBranches.php');
                const data = await response.json();
                setBranches(data);
            } catch (error) {
                console.error('Error fetching branches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
        fetchBranches();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewItemImage(reader.result.split(',')[1]); // Extract only the Base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddItem = async () => {
        if (!newItemName || isNaN(newItemPrice) || Number(newItemPrice) <= 0 || !selectedBranch || !selectedCategory || !newItemImage) {
            alert('Please fill all fields and upload an image.');
            return;
        }

        const payload = {
            name: newItemName,
            price: newItemPrice,
            branch_name: selectedBranch,
            image: newItemImage, // Base64-encoded image
            category: selectedCategory,
        };

        try {
            const response = await fetch('http://sparklingwater1.helioho.st/addMenuItem.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert('Item added successfully!');
                setModalIsOpen(false);
            } else {
                alert(result.message || 'Error adding menu item.');
            }
        } catch (error) {
            console.error('Error adding menu item:', error);
            alert('Error adding menu item.');
        }
    };


    
    const handleAddBranch = async () => {
        if (!newBranchName || !newBranchAddress || !newBranchCity || !newBranchPhone) {
            alert('Please fill in all the fields.');
            return;
        }
    
        const payload = {
            name: newBranchName,
            address: newBranchAddress,
            city: newBranchCity,
            phone_number: newBranchPhone,
        };
    
        try {
            const response = await fetch('http://sparklingwater1.helioho.st/addBranch.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            const result = await response.json();
            if (result.status === 'success') {
                alert('Branch added successfully!');
                setBranchModalIsOpen(false);
                setBranches((prevBranches) => [
                    ...prevBranches,
                    { name: newBranchName, address: newBranchAddress, city: newBranchCity, phone_number: newBranchPhone },
                ]); // Update the branches list
            } else {
                console.error('Error:', result.message); // Log the error message from PHP
                alert(result.message || 'Error adding branch.');
            }
        } catch (error) {
            console.error('Error adding branch:', error);
            alert('Error adding branch.');
        }
    };

    
    const categorizedItems = {
        Pizza: menuItems.filter(item => item.category === 'Pizza'),
        Pasta: menuItems.filter(item => item.category === 'Pasta'),
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-semibold mb-6">Manage Menu Items</h2>

            <div className="mb-4">
                <button
                    onClick={() => setModalIsOpen(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mr-4"
                >
                    Add New Item
                </button>
                <button
                    onClick={() => setBranchModalIsOpen(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                >
                    Add New Branch
                </button>
            </div>

            {/* Modal for adding a new branch */}
            <Modal
                isOpen={branchModalIsOpen}
                onRequestClose={() => setBranchModalIsOpen(false)}
                contentLabel="Add New Branch"
                style={{
                    content: {
                        maxHeight: '500px',
                        maxWidth: '400px',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '10px',
                    },
                }}
            >
                <h2 className="text-xl font-semibold mb-4">Add New Branch</h2>
                <div>
                    <label className="block mb-2 font-medium">Branch Name:</label>
                    <input
                        type="text"
                        value={newBranchName}
                        onChange={(e) => setNewBranchName(e.target.value)}
                        className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                        placeholder="Enter branch name"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium">Address:</label>
                    <input
                        type="text"
                        value={newBranchAddress}
                        onChange={(e) => setNewBranchAddress(e.target.value)}
                        className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                        placeholder="Enter address"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium">City:</label>
                    <input
                        type="text"
                        value={newBranchCity}
                        onChange={(e) => setNewBranchCity(e.target.value)}
                        className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                        placeholder="Enter city"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium">Phone Number:</label>
                    <input
                        type="text"
                        value={newBranchPhone}
                        onChange={(e) => setNewBranchPhone(e.target.value)}
                        className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                        placeholder="Enter phone number"
                    />
                </div>

                <button
                    onClick={handleAddBranch}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                >
                    Add Branch
                </button>
                <button
                    onClick={() => setBranchModalIsOpen(false)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg ml-2 hover:bg-red-700 transition duration-300"
                >
                    Cancel
                </button>
            </Modal>

            {/* Modal for adding a new item */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Add New Menu Item"
                style={{
                    content: {
                        maxHeight: '500px',
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
                    <label className="block mb-2 font-medium">Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                    >
                        <option value="">Select a category</option>
                        <option value="Pizza">Pizza</option>
                        <option value="Pasta">Pasta</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 font-medium">Select Branch:</label>
                    <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                    >
                        <option value="">Select a branch</option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.name}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-2 font-medium">Upload Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                    />
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
                <div className="flex space-x-8 mt-6">
                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold mb-4">
                            Pizza ({categorizedItems.Pizza.length} items)
                        </h3>
                        <ul className="space-y-2">
                            {categorizedItems.Pizza.map((item) => (
                                <li
                                    key={item.menu_id}
                                    className="border border-gray-300 bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
                                >
                                    {item.image && (
                                        <img
                                            src={`data:image/jpeg;base64,${item.image}`}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    )}
                                    <div>
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-gray-600 block">
                                            {`$${parseFloat(item.price).toFixed(2)}`}
                                        </span>
                                        <span className="text-gray-500 block">{item.category}</span>
                                        <span className="text-gray-600 block">{item.branch_name}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold mb-4">
                            Pasta ({categorizedItems.Pasta.length} items)
                        </h3>
                        <ul className="space-y-2">
                            {categorizedItems.Pasta.map((item) => (
                                <li
                                    key={item.menu_id}
                                    className="border border-gray-300 bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
                                >
                                    {item.image && (
                                        <img
                                            src={`data:image/jpeg;base64,${item.image}`}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    )}
                                    <div>
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-gray-600 block">
                                            {`$${parseFloat(item.price).toFixed(2)}`}
                                        </span>
                                        <span className="text-gray-500 block">{item.category}</span>
                                        <span className="text-gray-600 block">{item.branch_name}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            )}
        </div>
    );
};

export default MenuManagement;
    