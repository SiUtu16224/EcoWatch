<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "../config/db.php";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $title = $_POST['title'];
    $desc  = $_POST['description'];
    $lat   = $_POST['latitude'];
    $lng   = $_POST['longitude'];

    $fotoName = time() . "_" . $_FILES['photo']['name'];
    move_uploaded_file(
      $_FILES['photo']['tmp_name'],
      "../upload/" . $fotoName
    );

    $sql = "INSERT INTO reports 
      (title, description, latitude, longitude, photo)
      VALUES ('$title','$desc','$lat','$lng','$fotoName')";

    $conn->query($sql);

    echo json_encode(["success" => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = $conn->query("SELECT * FROM reports ORDER BY id DESC");
    echo json_encode($data->fetch_all(MYSQLI_ASSOC));
    exit;
}
