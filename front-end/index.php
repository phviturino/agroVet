<?php include 'includes/header.php';?>
    <main>
      <div class="container mt-5">
            <h1>Bem-vindo à Saúde Animal Agro e Vet</h1>
            <p>Encontre os melhores produtos para o cuidado dos seus animais de estimação e para a agricultura.</p>
      </div>
        <div class="container-fluid p-0 position-relative">
          <div class="row g-0">
            <div class="col-12">
              <img src="img/banner.png" alt="banner" class="img-fluid rounded-5">
            </div>
          </div>
        </div>
      

       <?php
      require_once __DIR__ . '/includes/conexao.php';

      $produtos = array();

      if($conexao) {
    
      $sql = "CALL sp_produtos_destaque()"; 
      $resultado = mysqli_query($conexao, $sql);

      if ($resultado && mysqli_num_rows($resultado) > 0) {
      while ($linha = mysqli_fetch_assoc($resultado)) {
            $produtos[] = $linha;
        }
    }
}
?>
       <div class="container my-5">
        <div class="d-flex align-items-center justify-content-center mb-4 border-bottom pb-3">
          <h2 class="fw-bold m-0  fs-3 text-dark text-uppercase destaque-vendas">🔥 Mais vendidos</h2>
        </div>

        <div class="row g-4">
          <?php foreach ($produtos as $produto): ?>
            <div class="col-6 col-sm-6 col-md-3">
            <div class="card h-100 border-0 shadow bg-dark  text-white position-relative">

            <div class="p-3 bg-white d-flex align-items-center justify-content-center container-foto-produto">
              <img src="img/<?=$produto['imagem'] ?>" class="img-fluid foto-produto" alt="<?=$produto['nome'] ?>">
            </div>

              <div class="card-body d-flex flex-column text-center">
              <h5 class="card-title fs-6 text-uppercase mb-2 nome-produto">
              <?=$produto['nome'] ?>
              </h5>

              <p class="card-text fw-bold fs-5 mt-auto mb-2 preço-produto">
                R$ <?= number_format($produto['preço'],2, ',', '.'); ?>
              </p>

          <a href="pages/produto-detalhes.php?id=<?php echo $produto['id']; ?>" class="btn btn-success btn-sm w-100 fw-bold py-2 text-uppercase mt-auto stretched-link">Ver Produtos</a>
          </div>
          </div>
          </div>
          <?php endforeach; ?>
          </div>

          <div class="text-center my-5">
            <a href="pages/produtos.php" class="btn btn-outline-dark px-5 py-2 fw-bold text-uppercase">Ver mais produtos</a> 
          </div>
          </div>

            <div class="container my-5">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <h2 class="fw-bold mb-3 text-start text-dark">Conheça nossa história</h2>
                  <p class="text-start">Fundada em 2020, a Saúde Animal Agro e Vet nasceu do sonho de oferecer produtos de qualidade para o cuidado dos animais e para a agricultura. Com uma equipe apaixonada por animais e comprometida com a excelência, buscamos proporcionar a melhor experiência de compra para nossos clientes.</p>
                  <p class="text-start">Desde o início, nosso foco tem sido a satisfação do cliente, oferecendo uma ampla variedade de produtos que atendem às necessidades de cada animal e agricultor.
                  Com quatro lojas físicas estrategicamente localizadas, estamos sempre prontos para atender nossos clientes com dedicação e profissionalismo.</p>

      <div class="row mt-5 text-center">

        <div class="col-3 ms-5">
          <h2 class="text-warning fw-bold">7+</h2>
          <p class="text-uppercase">Anos</p>
        </div>

        <div class="col-3">
          <h2 class="text-warning fw-bold">4</h2>
          <p class="text-uppercase">LOJAS</p>
        </div>

        <div class="col-3">
          <h2 class="text-warning fw-bold">1000+</h2>
          <p class="text-uppercase">Produtos</p>
        </div>

        </div>
                </div>
                  <div class="col-md-6">
                    <img class="img-fluid foto rounded-5" src="img/colaboradores.jpeg" alt="Colaboradores">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>      
      </main>
      <?php include 'includes/footer.php';?>