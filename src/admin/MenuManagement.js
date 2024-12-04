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
    const [newName, setNewName] = useState(''); // Edit item name
    const [newPrice, setNewPrice] = useState(''); // Edit item price
    const [editModalIsOpen, setEditModalIsOpen] = useState(false); // Add this state
    const [itemToEdit, setItemToEdit] = useState(null); // Track item to edit
    const [deleteModal, setDeleteModal] = React.useState({
        isVisible: false,
        menuId: null,
        itemName: '',
    });

    useEffect(() => {
        const fetchMenuItems = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://sparklingwater1.helioho.st/getMenuItems.php');
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
                const response = await fetch('https://sparklingwater1.helioho.st/getBranches.php');
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


    const handleImageChange = (e) => {
        const file = e.target.files[0];  // Get the first selected file
        if (file) {
            setNewItemImage(file);
        }
    };

    useEffect(() => {
        // Fetch branches (e.g., via an API call)
        fetch('https://sparklingwater1.helioho.st/getBranches.php')  // Example API endpoint
            .then((response) => response.json())
            .then((data) => setBranches(data));
    }, []);

    // Open the edit Modal  
    const openEditModal = (item) => {
        setItemToEdit(item);
        setNewName(item.name);
        setNewPrice(item.price);
        setEditModalIsOpen(true);
    };

    //delete an item
    const handleDeleteItem = async (menuId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }
        try {
            const response = await fetch(`https://sparklingwater1.helioho.st/updateMenuItem.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    menu_id: menuId,  // The ID of the item to delete
                    action: 'delete'  // The action indicating we want to delete the item
                }),
            });
    
            const result = await response.json();
            
            // Check the result's status
            if (result.status === 'success') {
                alert('Item deleted successfully!');
                // Refresh the menu list after deletion
                setMenuItems((prevItems) =>
                    prevItems.filter((item) => item.menu_id !== menuId)
                );
            } else {
                alert(result.message || 'Error deleting menu item.');
            }
        } catch (error) {
            console.error('Error deleting menu item:', error);
            alert('Error deleting menu item.');
        }
    };
    
    
    
    


    const handleSaveChanges = async () => {
        if (!newName || isNaN(newPrice) || Number(newPrice) <= 0) {
            alert('Please enter valid details.');
            return;
        }
    
        if (!selectedBranch) {
            alert('Please select a branch.');
            return;
        }
    
        // Convert the image file to Base64
        const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result.split(',')[1]); // Extract Base64 data
                reader.onerror = (error) => reject(error);
            });
        };
    
        const base64Image = newItemImage ? await convertToBase64(newItemImage) : null;
    
        // Prepare the payload
        const payload = {
            menu_id: itemToEdit.menu_id, // Send the menu_id of the item being edited
            name: newName,
            price: newPrice,
            branch_name: selectedBranch, // Assuming you select a branch
            category: selectedCategory,
            image: base64Image, // Send the Base64-encoded image
        };
    
        try {
            const response = await fetch('https://sparklingwater1.helioho.st/updateMenuItem.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            const result = await response.json();
            if (result.status === 'success') {
                alert('Item updated successfully!');
                // Update the item in the local state, including the updated image
                setMenuItems((prevItems) =>
                    prevItems.map((item) =>
                        item.menu_id === itemToEdit.menu_id
                            ? {
                                  ...item,
                                  name: newName,
                                  price: newPrice,
                                  category: selectedCategory,
                                  image: base64Image ? `data:image/jpeg;base64,${base64Image}` : item.image,
                              }
                            : item
                    )
                );
                setEditModalIsOpen(false);
            } else {
                alert(result.message || 'Error updating menu item.');
            }
        } catch (error) {
            console.error('Error updating menu item:', error);
            alert('Error updating menu item.');
        }
    };


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
            const response = await fetch('https://sparklingwater1.helioho.st/addMenuItem.php', {
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
            const response = await fetch('https://sparklingwater1.helioho.st/addBranch.php', {
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

                {/* Delete Confirmation Modal */}
<Modal
    isOpen={deleteModal.isVisible}
    onRequestClose={() => setDeleteModal({ isVisible: false, menuId: null, itemName: "" })}
    contentLabel="Delete Confirmation"
    style={{
        content: {
            maxHeight: "300px",
            maxWidth: "400px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
        },
    }}
>
    <h2 className="text-xl font-semibold mb-4">Delete Confirmation</h2>
    <p className="mb-6">
        Are you sure you want to delete <strong>{deleteModal.itemName}</strong>?
    </p>
    <div className="flex justify-end space-x-4">
        <button
            onClick={() => setDeleteModal({ isVisible: false, menuId: null, itemName: "" })}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
        >
            Cancel
        </button>
        <button
            onClick={() => {
                handleDeleteItem(deleteModal.menuId);
                setDeleteModal({ isVisible: false, menuId: null, itemName: "" });
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
        >
            Confirm
        </button>
    </div>
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

            {/* Modal for editing an item */}
                <Modal
                    isOpen={editModalIsOpen}
                    onRequestClose={() => setEditModalIsOpen(false)}
                    contentLabel="Edit Menu Item"
                    style={{
                        content: {
                            maxHeight: '400px',
                            maxWidth: '400px',
                            margin: 'auto',
                            padding: '20px',
                            borderRadius: '10px',
                        },
                    }}
                >
                    <h2 className="text-xl font-semibold mb-4">Edit Menu Item</h2>
                    
                    {/* Item Name */}
                    <div>
                        <label className="block mb-2 font-medium">Item Name:</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block mb-2 font-medium">Price:</label>
                        <input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                        />
                    </div>

                    {/* Branch Selection */}
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

                    {/* Upload New Image */}
                    <div>
                        <label className="block mb-2 font-medium">Upload New Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border border-gray-300 px-2 py-1 mb-4 w-full rounded-lg"
                        />
                        {newItemImage && (
                            <div className="mt-2">
                                <img
                                    src={`data:image/jpeg;base64,${newItemImage}`} 
                                    alt="Selected"
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    {/* Save and Cancel Buttons */}
                    <button
                        onClick={handleSaveChanges}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={() => setEditModalIsOpen(false)}
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
                    className="border border-gray-300 bg-white p-4 rounded-lg shadow-md flex items-center justify-between space-x-4"
                >
                    <div className="flex items-center space-x-4">
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
                    </div>
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => openEditModal(item)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() =>
                                setDeleteModal({
                                    isVisible: true,
                                    menuId: item.menu_id,
                                    itemName: item.name,
                                })}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                        >
                            Delete
                        </button>
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
                    className="border border-gray-300 bg-white p-4 rounded-lg shadow-md flex items-center justify-between space-x-4"
                >
                    <div className="flex items-center space-x-4">
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
                    </div>
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => openEditModal(item)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() =>
                                setDeleteModal({
                                    isVisible: true,
                                    menuId: item.menu_id,
                                    itemName: item.name,
                                })}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                        >
                            Delete
                        </button>
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
    