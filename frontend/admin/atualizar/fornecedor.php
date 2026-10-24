<?php
require_once __DIR__ . '/../verificar.php';
require_once __DIR__ . '/../../includes/conexao.php';

$id = $_POST['id'];
$nome = mysqli_real_escape_string($conexao, $_POST['nome']);
$telefone = mysqli_real_escape_string($conexao, $_POST['telefone']);
$email = mysqli_real_escape_string($conexao, $_POST['email']);

$sql = "UPDATE fornecedor SET nome = '$nome', telefone = '$telefone', email = '$email' WHERE id = '$id'";
$resultado = mysqli_query($conexao, $sql);

if (!$resultado) {
    die("Erro no UPDATE: " . mysqli_error($conexao));
}

header("location: ../listar/fornecedor.php");
exit;
?>