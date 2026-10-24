<?php
require_once __DIR__ . '/../verificar.php';
require_once __DIR__ . '/../../includes/conexao.php';

$id = $_POST['id'];
$nome = mysqli_real_escape_string($conexao, $_POST['nome']);
$preco = mysqli_real_escape_string($conexao, $_POST['preco']);
$descricao = mysqli_real_escape_string($conexao, $_POST['descricao']);
$id_categoria = mysqli_real_escape_string($conexao, $_POST['id_categoria']);
$imagem = mysqli_real_escape_string($conexao, $_POST['imagem']);

$sql = "UPDATE produto SET nome = '$nome', preço = '$preco', descricao = '$descricao', id_categoria = '$id_categoria', imagem = '$imagem' WHERE id = '$id'";
$resultado = mysqli_query($conexao, $sql);

if (!$resultado) {
    die("Erro no UPDATE: " . mysqli_error($conexao));
}

header("location: ../listar/produto.php");
exit;
?>