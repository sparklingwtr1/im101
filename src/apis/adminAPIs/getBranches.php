<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");
// Database configuration
$servername = "localhost";
$username = ""; // Adjust this as needed
$password = ""; // Adjust this as needed
$dbname = "restaurant"; // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Query to get branches
$sql = "SELECT id, name FROM branches";
$result = $conn->query($sql);

$branches = [];

// Fetch data
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $branches[] = $row; // Add each branch to the array
    }
}

// Return the branch data as JSON
echo json_encode($branches);

// Close connection
$conn->close();
?>
