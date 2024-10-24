<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Database connection details
$host = "localhost";
$db = "restaurant";
$user = "root";  // XAMPP MySQL default username
$pass = "";      // XAMPP MySQL default password is empty

// Create a new database connection
$conn = new mysqli($host, $user, $pass, $db);

// Check for connection errors
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Get the input data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input data
if (!isset($data['name']) || !isset($data['price']) || !isset($data['branch_name'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data.']);
    exit;
}

// Fetch the branch ID based on the branch name
$branch_name = $data['branch_name'];
$branchIdQuery = $conn->prepare("SELECT branch_id FROM branch WHERE name = ?");
$branchIdQuery->bind_param("s", $branch_name);
$branchIdQuery->execute();
$branchIdQuery->bind_result($branch_id);
$branchIdQuery->fetch();
$branchIdQuery->close();

// Check if branch ID was found
if (!$branch_id) {
    echo json_encode(['status' => 'error', 'message' => 'Branch not found.']);
    exit;
}

// Prepare and bind the SQL statement for inserting the menu item
$stmt = $conn->prepare("INSERT INTO menu_items (name, price, sales, branch_id) VALUES (?, ?, ?, ?)");
$sales = 0; // Initial sales set to 0
$stmt->bind_param("sdii", $data['name'], $data['price'], $sales, $branch_id); // Assuming price is decimal and other fields are integers

// Execute the statement and check for success
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Menu item added successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to add menu item: ' . $stmt->error]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
