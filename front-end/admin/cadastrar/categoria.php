<?php
    require_once __DIR__ . '/../verificar.php';
    include __DIR__ . '/../includes/header.php';
?>

<main class="container mt-5 mb-5">
    <h2 class="mb-4">Cadastrar Categoria</h2>

    <form action="../salvar/categoria.php" method="POST">
        <div class="mb-3">
            <label for="nome" class="form-label">Nome</label>
            <input type="text" class="form-control" id="nome" name="nome" required>
        </div>
        <div class="mb-3">
        <label for="descricao" class="form-label">Descrição</label>
        <textarea class="form-control" id="descricao" name="descricao" required></textarea>
    </div>
    <button type="submit" class="btn btn-success">Salvar</button>
    <a href="../listar/categoria.php" class="btn btn-secondary">Cancelar</a>
    </form>
</main>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>   