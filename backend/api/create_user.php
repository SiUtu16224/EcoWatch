<?php
include "../config/db.php";

$name = "Aku";
$email = "aku@gmail.com";
$password = password_hash("aku123", PASSWORD_DEFAULT);
$reward = 20;

$stmt = $conn->prepare(
  "INSERT INTO users (name, email, password, reward) VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("sssi", $name, $email, $password, $reward);

if ($stmt->execute()) {
    echo "User Andri berhasil dibuat";
} else {
    echo "Gagal: " . $conn->error;
}
