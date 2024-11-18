<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Database connection details
$host = "localhost";
$db = "restaurant";
$user = "root";
$pass = "";

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
if (!isset($data['fname']) || !isset($data['lname']) || !isset($data['phone_number']) || !isset($data['email']) || !isset($data['password']) || !isset($data['branch'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields.']);
    exit;
}


// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
    exit;
}

// Validate password length
if (strlen($data['password']) < 8) {
    echo json_encode(['status' => 'error', 'message' => 'Password must be at least 8 characters long.']);
    exit;
}

// Fetch the branch ID based on the branch name
$branch_name = $data['branch'];
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

// Hash the password before storing it
$hashed_password = password_hash($data['password'], PASSWORD_BCRYPT);

// Prepare and bind the SQL statement for inserting the employee
$stmt = $conn->prepare("INSERT INTO employee (fname, lname, phone_number, email, password, branch_id) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssi", $data['fname'], $data['lname'], $data['phone_number'], $data['email'], $hashed_password, $branch_id);

// Execute the statement and check for success
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Employee added successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to add employee: ' . $stmt->error]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
