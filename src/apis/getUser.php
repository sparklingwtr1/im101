<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers to allow cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:3000"); // Adjust this to your frontend URL
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and preflight OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow necessary headers
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // If this is an OPTIONS request, exit early.
    exit(0);
}

// Database configuration
$host = 'localhost'; 
$dbname = 'restaurant'; 
$username = '';  // Replace with your database username
$password = '';  // Replace with your database password

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['message' => 'Connection failed: ' . $conn->connect_error]));
}

// Get data from the request
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'])) {
    echo json_encode(['message' => 'Email is required']);
    exit();
}

$email = $conn->real_escape_string($data['email']);

// Prepare and execute the query
$stmt = $conn->prepare("SELECT username FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result) {
    if ($result->num_rows > 0) {
        // Fetch user details
        $row = $result->fetch_assoc();

        // Return the username if it exists
        if (!empty($row['username'])) {
            echo json_encode([
                'username' => $row['username'],
            ]);
        } else {
            echo json_encode(['message' => 'Username not found']);
        }
    } else {
        echo json_encode(['message' => 'No user found with this email']);
    }
} else {
    echo json_encode(['message' => 'Error executing query: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>
