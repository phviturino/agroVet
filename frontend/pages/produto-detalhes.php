<?php 
include '../includes/header.php';
require_once __DIR__ . '/../includes/conexao.php';

$produtoEncontrado = null;

if (isset($_GET['id']) && !empty($_GET['id'])) {
    $idProduto = (int)$_GET['id'];

    if($conexao){
        $sql = "SELECT produto.*, categoria.nome AS categoria 
        FROM produto 
        LEFT JOIN categoria ON produto.id_categoria = categoria.id
        WHERE produto.id = $idProduto";
        $resultado = mysqli_query($conexao, $sql);

        if ($resultado && mysqli_num_rows($resultado) > 0){
            $produtoEncontrado = mysqli_fetch_assoc($resultado);
        }
    }
}

$numeroWhatsapp = "5544998514080"; 
?>

<main class="container my-5 pt-4">
    <?php if ($produtoEncontrado): ?>
    <?php
    $mensagemWhats = "Olá! Gostaria de mais informações sobre o produto: " . $produtoEncontrado['nome'];
    $linkWhatsapp = "https://api.whatsapp.com/send?phone=" . $numeroWhatsapp . "&text=" . urlencode($mensagemWhats);
    ?>

    <div class="mb-4">
        <a href="../pages/produtos.php" class="btn btn-outline-dark btn-sm fw-bold text-uppercase px-3">
            ← Voltar ao Catálogo
        </a>
    </div>

    <div class="row g-5">
        <div class="col-12 col-md-6">
            <div class="border rounded shadow-sm p-4 bg-white d-flex align-items-center justify-content-center box-produto">
                <img src="../img/<?= $produtoEncontrado['imagem'];?>" class="img-fluid box-img" alt="<?= $produtoEncontrado['nome']; ?>">
            </div>
        </div>
        
        <div class="col-12 col-md-6 d-flex flex-column justify-content-center">
            <span class="badge bg-secondary text-uppercase align-self-start mb-2 px-3 py-2 texto-pequeno">
                Categoria <?= $produtoEncontrado['categoria']; ?>
            </span>


            <h1 class="text-start fw-bold text-dark text-uppercase mb-3 fs-2 lh-sm-">
                <?= $produtoEncontrado['nome']; ?>
            </h1> 

            <hr class="my-4 text-secondary">

            <div class="mb-4">
                <span class="text-muted d-block mb-1 small">Preço de catálogo: </span>
                <h3 class="text-dark fw-bold mb-1 fs-3">
                    R$ <?= number_format($produtoEncontrado['preço'], 2, ',', '.'); ?>
                </h3> 

    <div class="alert alert-light border p-3 mb-4 rounded-3 small text-muted">
        📌 <strong>Nota: </strong> Atualmente não realizamos vendas direto pelo site. Clique no botão abaixo para falar com um de nossos atendentes no whatsApp e garantir seu produto!
    </div>

        <a href="<?= $linkWhatsapp; ?>" target="_blank" rel="noopener noreferrer" class="btn btn-lg w-100 fw-bold py-3 text-uppercase shadow-sm d-flex align-items-center justify-content-center gap-2 fs-5 btn-whatsapp">
    💬 Comprar via WhatsApp
        </a>
    </div>
</div>

<?php else: ?>
    <div class="row my-5 py-5">
        <div class="col-12 text-center">
            <h2 class="text-danger fw-bold">Ops! Produto não encontrado.</h2>
        <a href="pages/produtos.php" class="btn btn-dark text-uppercase px-4 mt-3">Voltar aos produtos</a>
        </div>
    </div>

<?php endif; ?></main>

<?= include '../includes/footer.php'; ?>