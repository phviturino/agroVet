<?php
require_once __DIR__ . '/../verificar.php';
require_once __DIR__ . '/../../includes/conexao.php';

$nome = mysqli_real_escape_string($conexao, $_POST['nome']);
$telefone = mysqli_real_escape_string($conexao, $_POST['telefone']);
$email = mysqli_real_escape_string($conexao, $_POST['email']);

$sql = "INSERT INTO fornecedor (nome, telefone, email) VALUES ('$nome', '$telefone', '$email')";
$resultado = mysqli_query($conexao, $sql);
header("location:../listar/fornecedor.php");
exit;
?>