<?php
require_once __DIR__ . '/../verificar.php';
require_once __DIR__ . '/../../includes/conexao.php';

$id = mysqli_real_escape_string($conexao, $_GET['id']);

$sqlCheck = "SELECT COUNT(*) AS total FROM fornecedor_produto WHERE id_produto = '$id'";
$resultadoCheck = mysqli_query($conexao, $sqlCheck);
$check_produto = mysqli_fetch_assoc($resultadoCheck);

if ($check_produto['total'] > 0) {
    header("Location: ../listar/produto.php?erro=produto_em_uso");
    exit;
}

$sql = "DELETE FROM produto WHERE id = '$id'";
$resultado = mysqli_query($conexao, $sql);

if (!$resultado) {
    die("Erro no DELETE: " . mysqli_error($conexao));
}

header("Location: ../listar/produto.php?sucesso=produto_excluido");
exit;
?>