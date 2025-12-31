<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "../config/cors.php";
include "../config/db.php";

$id = $_GET['id'];
$data = $conn->query(
"SELECT articles.*, categories.name AS category
 FROM articles
 JOIN categories ON articles.category_id = categories.id
 WHERE articles.id=$id"
);

echo json_encode($data->fetch_assoc());
