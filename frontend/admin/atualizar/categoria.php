<?php
require_once __DIR__ . '/../verificar.php';
require_once __DIR__ . '/../../includes/conexao.php';

$id = $_POST['id'];
$nome = mysqli_real_escape_string($conexao, $_POST['nome']);
$descricao = mysqli_real_escape_string($conexao, $_POST['descricao']);

$sql = "UPDATE categoria SET nome = '$nome', descricao = '$descricao' WHERE id = '$id'";
$resultado = mysqli_query($conexao, $sql);

if (!$resultado) {
    die("Erro no UPDATE: " . mysqli_error($conexao));
}

header("location: ../listar/categoria.php");
exit;
?>