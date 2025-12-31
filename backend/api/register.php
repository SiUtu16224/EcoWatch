<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$name || !$email || !$password) {
  http_response_code(400);
  echo json_encode(["message" => "Data tidak lengkap"]);
  exit;
}

// cek email sudah ada
$cek = $conn->prepare("SELECT id FROM users WHERE email=?");
$cek->bind_param("s", $email);
$cek->execute();
$cek->store_result();

if ($cek->num_rows > 0) {
  http_response_code(409);
  echo json_encode(["message" => "Email sudah terdaftar"]);
  exit;
}

$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare(
  "INSERT INTO users (name,email,password,reward,created_at)
   VALUES (?,?,?,0,NOW())"
);
$stmt->bind_param("sss", $name, $email, $hash);
$stmt->execute();

echo json_encode(["message" => "Berhasil daftar"]);
