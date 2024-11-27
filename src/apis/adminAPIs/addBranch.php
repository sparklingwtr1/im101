<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Database connection
$servername = "localhost"; // Database server
$username = "root"; // Database username
$password = ""; // Database password
$dbname = "restaurant"; // Database name

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"));

// Extract the values from the request payload
$branchName = $data->name ?? '';
$branchAddress = $data->address ?? '';
$branchCity = $data->city ?? '';
$branchPhone = $data->phone_number ?? '';

// Check if all required fields are provided
if (!$branchName || !$branchAddress || !$branchCity || !$branchPhone) {
    echo json_encode(["status" => "error", "message" => "Please fill in all the fields."]);
    exit;
}

// Prepare the SQL query to insert the new branch into the database
$sql = "INSERT INTO branches (name, address, city, phone_number) VALUES (?, ?, ?, ?)";

// Prepare and bind
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $branchName, $branchAddress, $branchCity, $branchPhone);

// Execute the query
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Branch added successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error adding branch."]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
