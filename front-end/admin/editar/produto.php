<?php
require_once __DIR__ . '/../verificar.php';
require_once __DIR__ . '/../../includes/conexao.php';
include __DIR__ . '/../includes/header.php';

$id = $_GET['id'];
$produto = mysqli_fetch_assoc(mysqli_query($conexao, "SELECT * FROM produto WHERE id = $id"));
$categorias = mysqli_query($conexao, "SELECT * FROM categoria");
?>

<main class="container mt-3 mb-5">
    <h2 class="mb-4">Editar Produto</h2>
    
    <form action="../atualizar/produto.php" method="POST">
        <input type="hidden" name="id" value="<?php echo $produto['id']; ?>" required>

    <div class="mb-3">
        <label for="nome" class="form-label">Nome</label>
        <input type="text" class="form-control" id="nome" name="nome" value="<?php echo $produto['nome']; ?>" required> 
    </div>

    <div class="mb-3">
        <label for="descricao" class="form-label">Descrição</label>
        <input type="text" class="form-control" id="descricao" name="descricao" value="<?php echo $produto['descricao']; ?>" required>
    </div>

    <div class="mb-3">
        <label for="preco" class="form-label">Preço</label>
        <input type="number" class="form-control" id="preco" name="preco" value="<?php echo $produto['preço']; ?>" required>
    </div>

    <div class="mb-3">
        <label for="id_categoria" class="form-label">Categoria</label>
        <select class="form-control" name="id_categoria" id="id_categoria" required>
        <option value="">Selecione uma categoria</option>
            <?php while ($cat = mysqli_fetch_assoc($categorias)): ?>
            <option value="<?php echo $cat['id']; ?>" <?php echo ($cat['id'] == $produto['id_categoria']) ? 'selected' : ''; ?>>
                <?php echo $cat['nome']; ?>
            </option>
            <?php endwhile; ?>
        </select>
    </div>

    <div class="mb-3">
        <label for="imagem" class="form-label">Nome da Imagem</label>
        <input type="text" class="form-control" id="imagem" name="imagem" value="<?php echo $produto['imagem']; ?>">
    </div>

    <button type="submit" class="btn btn-success">Atualizar</button>
    <a href="../listar/produto.php" class="btn btn-secondary">Cancelar</a>
    </form>
</main>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>