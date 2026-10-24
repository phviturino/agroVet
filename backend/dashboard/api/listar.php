<?php
    require_once __DIR__ . '/../../includes/conexao.php';

    header('Content-Type: application/json; charset=utf-8');

    $categoria = isset($_GET['categoria']) && $_GET['categoria'] !== '' ? $_GET['categoria'] : null;
    $busca = isset($_GET['busca']) && $_GET['busca'] !== '' ? $_GET['busca'] : null;
    $pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
    $limite = 20;

    $offset = ($pagina - 1) * $limite;

    $sql = "CALL sp_listar_produtos(?, ?, ?, ?)";
    $stmt = mysqli_prepare($conexao, $sql);

    mysqli_stmt_bind_param($stmt, "isii", $categoria, $busca, $limite, $offset);

    mysqli_stmt_execute($stmt);
    $resultado = mysqli_stmt_get_result($stmt);

    $produto = array();
    while ($linha = mysqli_fetch_assoc($resultado)) {
        $produto[] = $linha;
    }

    echo json_encode($produto);

    mysqli_stmt_close($stmt);
?>