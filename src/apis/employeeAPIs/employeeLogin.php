<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Database configuration
$host = 'localhost';
$dbname = 'restaurant';
$username = 'root';
$password = '';

// Create database connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// Get data from request
$data = json_decode(file_get_contents("php://input"), true);
$employeeId = isset($data['employeeId']) ? $conn->real_escape_string($data['employeeId']) : null;
$password = isset($data['password']) ? $data['password'] : null;

if (!$employeeId || !$password) {
    echo json_encode(['error' => 'Employee ID and password are required']);
    exit;
}

// Check if the employee exists in the database
$query = "SELECT employee_id, password FROM employees WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $employeeId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $employee = $result->fetch_assoc();

    // Verify password
    if ($employee['password'] === $password) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Employee not found']);
}

// Close connection
$stmt->close();
$conn->close();
?>
