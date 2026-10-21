<?php
require_once __DIR__ . '/../verificar.php';
require_once __DIR__ . '/../../includes/conexao.php';

$nome = mysqli_real_escape_string($conexao, $_POST['nome']);
$descricao = mysqli_real_escape_string($conexao, $_POST['descricao']);
$preço = mysqli_real_escape_string($conexao, $_POST['preco']);
$id_categoria = mysqli_real_escape_string($conexao, $_POST['id_categoria']);
$imagem = mysqli_real_escape_string($conexao, $_POST['imagem']);

$sql = "INSERT INTO produto (nome, descricao, preço, id_categoria, imagem) VALUES ('$nome', '$descricao', '$preço', '$id_categoria', '$imagem')";
$resultado = mysqli_query($conexao, $sql);
header("location:../listar/produto.php");
exit;
?>