<?php
require_once __DIR__ . '/../../includes/conexao.php';

header('Content-Type: application/json; charset=utf-8');

$sql = "CALL sp_produtos_destaque()";
$resultado = mysqli_query($conexao, $sql);

$produtos = array();
while ($linha = mysqli_fetch_assoc($resultado)) {
    $produtos[] = $linha;
}

echo json_encode($produtos);
?>