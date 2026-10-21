<?php 
session_start();

if(!isset($_SESSION['admin_id'])) {
    header('Location: /agrovet/admin/login.php');
    exit;
}