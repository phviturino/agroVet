<?php
require_once __DIR__ . '/../verificar.php';
require_once __DIR__ . '/../../includes/conexao.php';
include __DIR__ . '/../includes/header.php';

$id = $_GET['id'];

$sql = "SELECT * FROM categoria where id = $id";
$resultado = mysqli_query($conexao, $sql);
$categoria = mysqli_fetch_assoc($resultado);
?>

<main class="container mt-3 mb-5">
    <h2 class="mb-4">Editar Categoria</h2>
    
    <form action="../atualizar/categoria.php" method="POST">
        <input type="hidden" name="id" value="<?php echo $categoria['id']; ?>">

    <div class="mb-3">
        <label for="nome" class="form-label">Nome</label>
        <input type="text" class="form-control" id="nome" name="nome" value="<?php echo $categoria['nome']; ?>" required> 
    </div>

    <div class="mb-3">
        <label for="descricao" class="form-label">Descrição</label>
        <textarea class="form-control" id="descricao" name="descricao" required><?php echo $categoria['descricao']; ?></textarea>
    </div>

    <button type="submit" class="btn btn-success">Atualizar</button>
    <a href="../listar/categoria.php" class="btn btn-secondary">Cancelar</a>
    </form>
</main>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>