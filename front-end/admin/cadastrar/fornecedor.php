<?php
require_once __DIR__ . '/../verificar.php';
include __DIR__ . '/../includes/header.php';
?>

<main class="container mt-5 mb-5">
    <h2 class="mb-4">Cadastrar Fornecedor</h2>

    <form action="../salvar/fornecedor.php" method="POST">
        <div class="mb-3">
            <label for="nome" class="form-label">Nome</label>
            <input type="text" class="form-control" id="nome" name="nome" required>
        </div>
        <div class="mb-3">
            <label for="telefone" class="form-label">Telefone</label>
            <input type="text" class="form-control" id="telefone" name="telefone" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" required>
        </div>
        <button type="submit" class="btn btn-success">Salvar</button>
        <a href="../listar/fornecedor.php" class="btn btn-secondary">Cancelar</a>
    </form>
</main>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>   