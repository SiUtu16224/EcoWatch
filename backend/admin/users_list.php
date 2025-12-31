<?php
require_once "auth_check.php";
require_once "../config/db.php";

$users = $pdo->query("
  SELECT id, name, email, reward, created_at
  FROM users
  ORDER BY created_at DESC
")->fetchAll();

echo json_encode($users);
