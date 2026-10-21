<?php
    require_once __DIR__ . '/../verificar.php';
    require_once __DIR__ . '/../../includes/conexao.php';
    include __DIR__ . '/../includes/header.php';

    $sql = "SELECT * FROM categoria";
    $categorias = mysqli_query($conexao, $sql);
?>

<main class="container mt-5 mb-5">
    <h2 class="mb-4">Cadastrar Produto</h2>

    <form action="../salvar/produto.php" method="POST">
        <div class="mb-3">
            <label for="nome" class="form-label">Nome</label>
            <input type="text" class="form-control" id="nome" name="nome" required>
        </div>

        <div class="mb-3">
            <label for="descricao" class="form-label">Descrição</label>
            <input type="text" class="form-control" id="descricao" name="descricao" required>
        </div>

        <div class="mb-3">
            <label for="preco" class="form-label">Preço</label>
            <input type="number" class="form-control" id="preco" name="preco" step="0.01" required>
        </div>

        <div class="mb-3">
            <label for="id_categoria" class="form-label">Categoria</label>
            <select class="form-control" name="id_categoria" id="id_categoria" required>
                <?php
                while ($cat = mysqli_fetch_assoc($categorias)): ?>
                <option value="<?php echo $cat['id']; ?>"><?php echo $cat['nome']; ?></option>
                <?php endwhile; ?>
            </select>
        </div>

        <div class="mb-3">
            <label for="imagem" class="form-label">Nome da imagem</label>
            <input type="text" class="form-control" id="imagem" name="imagem"> 
        </div>

        <button type="submit" class="btn btn-success">Salvar</button>
        <a href="../listar/produto.php" class="btn btn-secondary">Cancelar</a>
    </form>
</main>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>   