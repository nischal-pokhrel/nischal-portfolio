<?php
// branch-updates-store.php
require 'config.php';

if (!isset($_SESSION['branch_id'])) {
    header('Location: ../branch-login.html');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $branch_id = $_SESSION['branch_id'];
    $title     = trim($_POST['title'] ?? '');
    $body      = trim($_POST['body'] ?? '');

    if ($title === '' || $body === '') {
        header('Location: ../branch-dashboard.html?error=update_validation');
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO announcements (branch_id, title, body) VALUES (?, ?, ?)');
    $stmt->execute([$branch_id, $title, $body]);

    header('Location: ../branch-dashboard.html?success=update_created');
    exit;
}
