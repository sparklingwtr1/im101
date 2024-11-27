<?php
// Set headers for CORS and content type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Database connection details
$host = "localhost";
$db = "restaurant";
$user = "root";
$pass = "";

// Create database connection
$conn = new mysqli($host, $user, $pass, $db);

// Check if the connection is successful
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Query to fetch the total number of employees
$query = "SELECT COUNT(employee_id) AS total_employees FROM Employees";

// Execute the query
$result = $conn->query($query);

// Check if the query executed successfully
if ($result) {
    $data = $result->fetch_assoc();
    // Return the total number of employees as JSON
    echo json_encode(["total_employees" => $data['total_employees']]);
} else {
    echo json_encode(["error" => "Failed to retrieve employee count"]);
}

// Close the connection
$conn->close();
?>
