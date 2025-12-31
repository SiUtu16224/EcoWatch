<?php
require_once "auth_check.php";
require_once "../config/db.php";

$data = $pdo->query("
  SELECT r.*, u.name 
  FROM reports r
  JOIN users u ON r.user_id = u.id
  ORDER BY r.created_at DESC
")->fetchAll();

echo json_encode($data);
