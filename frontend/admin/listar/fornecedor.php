<?php
require_once __DIR__ . '/../verificar.php';
require_once __DIR__ . '/../../includes/conexao.php';
include __DIR__ . '/../includes/header.php';

$sql = "SELECT * FROM fornecedor";
$resultado = mysqli_query($conexao, $sql);
?>

<main class="container mt-5 mb-5">

<?php if (isset($_GET['erro']) && $_GET['erro'] === 'fornecedor_em_uso'): ?>
        <div class="alert alert-danger" role="alert">
            Não é possível excluir este fornecedor porque existem produtos vinculados a ele. Remova ou reatribua os produtos antes de excluir o fornecedor.
        </div>
    <?php endif; ?>

    <?php if (isset($_GET['sucesso']) && $_GET['sucesso'] === 'fornecedor_excluido'): ?>
        <div class="alert alert-success" role="alert">
            Fornecedor excluído com sucesso!
        </div>
    <?php endif; ?>

    <h2 class="mb-4">Fornecedores</h2>

    <a href="../cadastrar/fornecedor.php" class="btn btn-success mb-3">Novo Fornecedor</a>

    <table class="table table-striped">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($linha = mysqli_fetch_assoc($resultado)): ?>
                <tr>
                    <td><?php echo $linha['id']; ?></td>
                    <td><?php echo $linha['nome']; ?></td>
                    <td><?php echo $linha['telefone']; ?></td>
                    <td><?php echo $linha['email']; ?></td>
                    <td>
                        <a href="../editar/fornecedor.php?id=<?php echo $linha['id']; ?>" class="btn btn-warning btn-sm">Editar</a>
                        <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#modalExcluir"
                            data-id="<?php echo $linha['id']; ?>" data-nome="<?php echo htmlspecialchars($linha['nome']); ?>">
                            Excluir
                        </button>
                    </td>
                </tr>
                <?php endwhile; ?>
        </tbody>
    </table>
</main>

<div class="modal fade" id="modalExcluir" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Confirmar Exclusão</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
                <p>Tem certeza que deseja excluir o fornecedor <strong id="nomeItemExcluir"></strong>? Essa ação não pode ser desfeita.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <a href="#" id="linkConfirmarExclusao" class="btn btn-danger">Sim, excluir</a>
            </div>
        </div>
    </div>
</div>
<script>
    document.getElementById('modalExcluir').addEventListener('show.bs.modal', function (event) {
        var botao = event.relatedTarget;
        document.getElementById('nomeItemExcluir').textContent = botao.getAttribute('data-nome');
        document.getElementById('linkConfirmarExclusao').href = '../excluir/fornecedor.php?id=' + botao.getAttribute('data-id');
    });
</script>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>