<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");
// Database configuration
$servername = "localhost";
$username = "root"; // Adjust this as needed
$password = ""; // Adjust this as needed
$dbname = "restaurant"; // Replace with your actual database name
// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}
// Call the stored function
$result = $mysqli->query("SELECT getMenuItemCount() AS itemCount");

if ($result) {
    $data = $result->fetch_assoc();
    echo json_encode($data);
} else {
    echo json_encode(["error" => "Failed to fetch menu item count."]);
}

$mysqli->close();
?>
