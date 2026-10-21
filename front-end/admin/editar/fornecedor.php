<?php
require_once __DIR__ . '/../verificar.php';
include_once __DIR__ . '/../../includes/conexao.php';
include __DIR__ . '/../includes/header.php';

$id = $_GET['id'];
$fornecedor = mysqli_fetch_assoc(mysqli_query($conexao, "SELECT * FROM fornecedor WHERE id = $id"));
?>

<main class="container mt-3 mb-5">
    <h2 class="mb-4">Editar Fornecedor</h2>
    
    <form action="../atualizar/fornecedor.php" method="POST">
        <input type="hidden" name="id" value="<?php echo $fornecedor['id']; ?>" required>

    <div class="mb-3">
        <label for="nome" class="form-label">Nome</label>
        <input type="text" class="form-control" id="nome" name="nome" value="<?php echo $fornecedor['nome']; ?>" required> 
    </div>

    <div class="mb-3">
        <label for="telefone" class="form-label">Telefone</label>
        <input type="text" class="form-control" id="telefone" name="telefone" value="<?php echo $fornecedor['telefone']; ?>" required>
    </div>

    <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" name="email" value="<?php echo $fornecedor['email']; ?>" required>
    </div>

    <button type="submit" class="btn btn-success">Atualizar</button>
    <a href="../listar/fornecedor.php" class="btn btn-secondary">Cancelar</a>
    </form>
</main>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>