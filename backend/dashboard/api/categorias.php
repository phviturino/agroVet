<?php
    require_once __DIR__ . '/../../includes/conexao.php';

    header('Content-Type: application/json; charset=utf-8');

    $sql = "SELECT * FROM categoria";
    $resultado = mysqli_query($conexao, $sql);
    $categoria = array();

    while ($linha = mysqli_fetch_assoc($resultado)) {
        $categoria[] = $linha;
    }

    echo json_encode($categoria, JSON_UNESCAPED_UNICODE);

?>