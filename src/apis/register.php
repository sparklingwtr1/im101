<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Database connection details
$host = "localhost";
$dbname = "restaurant";
$username = "";  // XAMPP MySQL default username
$password = "";      // XAMPP MySQL default password is empty

// Create MySQL connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the raw POST data
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if required fields are present
    $requiredFields = ['email', 'username', 'password', 'phone_number', 'fname', 'lname'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["message" => "$field is required."]);
            exit();
        }
    }

    // Extract data from the request
    $email = $data['email'];
    $username = $data['username'];
    $password = password_hash($data['password'], PASSWORD_BCRYPT);  // Hash the password
    $phone_number = $data['phone_number'];
    $fname = $data['fname'];
    $lname = $data['lname'];

    // Check if the email already exists
    $stmt = $conn->prepare("SELECT * FROM CUSTOMER WHERE email = ?");
    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(["message" => "Error in preparing statement: " . $conn->error]);
        exit();
    }
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(["message" => "Email already registered"]);
    } else {
        // Prepare statement to insert new user data
        $stmt = $conn->prepare("INSERT INTO CUSTOMER (email, username, password, fname, lname, phone_number) VALUES (?, ?, ?, ?, ?, ?)");
        
        if ($stmt === false) {
            http_response_code(500);
            echo json_encode(["message" => "Error in preparing statement: " . $conn->error]);
            exit();
        }

        // Bind and execute the statement
        $stmt->bind_param("ssssss", $email, $username, $password, $fname, $lname, $phone_number);

        if ($stmt->execute()) {
            http_response_code(201); // Created
            echo json_encode(["message" => "Account created successfully"]);
        } else {
            // Output detailed MySQL error
            http_response_code(500);
            echo json_encode(["message" => "Failed to create account: " . $stmt->error]);
        }
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
} else {
    // Return a 405 Method Not Allowed response for non-POST requests
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}
?>
