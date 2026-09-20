<?php
// branch-login.php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        header('Location: ../branch-login.html?error=invalid');
        exit;
    }

    $stmt = $pdo->prepare('SELECT * FROM branches WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $branch = $stmt->fetch();

    if ($branch && password_verify($password, $branch['password_hash'])) {
        $_SESSION['branch_id']   = $branch['id'];
        $_SESSION['branch_name'] = $branch['name'];
        header('Location: ../branch-dashboard.html');
    } else {
        header('Location: ../branch-login.html?error=auth');
    }
    exit;
}
