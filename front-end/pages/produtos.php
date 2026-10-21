<?php include __DIR__ . '/../includes/header.php'; ?>

<main class="container mt-5 mb-5">

    <div class="d-flex flex-warp justify-content-center gap-2 mb-3" id="categorias-nav-links">
        <!-- categorias -->
    </div>

    <div class="row g-3 mb-4">
        <div class="col-md-6">
            <div class="bg-light rounded p-3 text-center h-100">
                <p class="text-muted mb-1 small">Valor total nessa categoria</p>
                <p id="total-categoria" class="fw-bold"></p>
            </div>
        </div>
    <div class="col-md-6">
            <div class="bg-warning bg-opacity-25 rounded p-3 text-center h-100">
                <p class="text-muted mb-1 small">Categoria em destaque</p>
                <p id="categoria-destaque" class="fw-bold"></p>
            </div>
        </div>
    </div>

    <h2 class="text-center mb-5 text-dark catalogo-titulo">
        Todos os nossos produtos
    </h2>
    
    <button id="btn-ordenar" class="btn btn-outline-dark mb-3">Ordenar de Z-a</button>
     
    <div class="row row-cols-2 row-cols-md-4 g-4" id="lista-produtos">
        <!-- cards -->
    </div>

    <div class="text-center mt-4">
        <button id="btn-carregar-mais" class="btn btn-success">Ver mais produtos</button>
    </div>

</main>

<?php include_once __DIR__ . '/../includes/footer.php'; ?>

<script src="../dashboard/dist/main.js"></script>