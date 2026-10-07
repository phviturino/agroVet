<?php
    require_once __DIR__ . '/../verificar.php';
    require_once __DIR__ . '/../../includes/conexao.php';

$nome = mysqli_real_escape_string($conexao, $_POST['nome']);
$descricao = mysqli_real_escape_string($conexao, $_POST['descricao']);

$sql = "INSERT INTO categoria(nome, descrição) VALUES ('$nome', '$descricao')";
$resultado = mysqli_query($conexao, $sql);

header("location: ../listar/categoria.php");
exit;
?>