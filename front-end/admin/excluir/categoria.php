<?php
require_once __DIR__ . '/../verificar.php';
require_once __DIR__ . '/../../includes/conexao.php';

$id = mysqli_real_escape_string($conexao, $_GET['id']);

$sqlCheck = "SELECT COUNT(*) AS total FROM produto WHERE id_categoria = '$id'";
$resultadoCheck = mysqli_query($conexao, $sqlCheck);
$check_produto = mysqli_fetch_assoc($resultadoCheck);

if ($check_produto['total'] > 0) {
    header("Location: ../listar/categoria.php?erro=categoria_em_uso");
    exit;
}

$sql = "DELETE FROM categoria WHERE id = '$id'";
$resultado = mysqli_query($conexao, $sql);

if (!$resultado) {
    die("Erro no DELETE: " . mysqli_error($conexao));
}

header("Location: ../listar/categoria.php?sucesso=categoria_excluida");
exit;
?>