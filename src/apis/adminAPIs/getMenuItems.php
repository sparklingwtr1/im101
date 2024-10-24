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

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch menu items
$sql = "SELECT menu_items.*, branch.name AS branch_id FROM menu_items JOIN branch ON menu_items.branch_id = branch.branch_id";
$result = $conn->query($sql);

$menuItems = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $menuItems[] = $row;
    }
}

echo json_encode($menuItems);
$conn->close();
?>
