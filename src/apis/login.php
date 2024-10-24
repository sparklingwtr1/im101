<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Database connection parameters
$servername = "localhost";
$username = ""; // Adjust this as needed
$password = ""; // Adjust this as needed
$dbname = "restaurant"; // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// Get the JSON input
$input = json_decode(file_get_contents('php://input'), true);
 
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

// Check if email and password are provided
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['message' => 'Email and password are required']);
    exit;
}

// Prepare and execute the query to find the user
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['message' => 'Database query preparation failed']);
    exit;
}

$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

// Check if the email exists
if ($result->num_rows === 1) {
    $users = $result->fetch_assoc();

    // Verify the password
    if (password_verify($password, $users['password'])) {
        http_response_code(200);
        echo json_encode(['message' => 'Login successful', 'email' => $users['email']]);
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(['message' => 'Incorrect password']);
    }
} else {
    http_response_code(404); // Not Found
    echo json_encode(['message' => 'Email not found']);
}

// Close the connection
$stmt->close();
$conn->close();
?>
