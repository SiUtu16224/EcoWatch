<?php
header("Content-Type: application/json");
require_once "../config/db.php";

$sql = "SELECT id, name, reward 
        FROM users 
        ORDER BY reward DESC 
        LIMIT 50";

$result = $conn->query($sql);

$data = [];
$rank = 1;

while ($row = $result->fetch_assoc()) {
  $row["rank"] = $rank++;
  $data[] = $row;
}

echo json_encode($data);
