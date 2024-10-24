<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Database connection
$servername = "localhost";
$username = "root"; // Change if you have a different username
$password = ""; // Change if you have a password
$dbname = "your_database_name"; // Change to your database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Handle POST request to add an employee
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate the data
    $fname = $conn->real_escape_string($data['fname']);
    $lname = $conn->real_escape_string($data['lname']);
    $phone_number = $conn->real_escape_string($data['phone_number']);
    $email = $conn->real_escape_string($data['email']);
    
    // Assuming you want to set a default branch_id for now
    $branch_id = 1; // Change this as needed

    // Check if the email already exists
    $checkEmailQuery = "SELECT * FROM employee WHERE email='$email'";
    $result = $conn->query($checkEmailQuery);
    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists.']);
        exit;
    }

    // Insert new employee into the database
    $sql = "INSERT INTO employee (branch_id, fname, lname, phone_number, email) VALUES ('$branch_id', '$fname', '$lname', '$phone_number', '$email')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['status' => 'success', 'message' => 'Employee added successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error: ' . $conn->error]);
    }
}

$conn->close();
?>
