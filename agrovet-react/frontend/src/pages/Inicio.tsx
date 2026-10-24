import React, { useEffect, useState } from 'react';

// Interface do Produto tipada conforme o retorno da Procedure/Banco
interface Produto {
  id: number;
  nome: string;
  preço: number;
  imagem: string;
}

export default function Inicio() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Busca os produtos em destaque da API Node.js assim que a tela carrega
  useEffect(() => {
    fetch('/api/produtos/destaque')
      .then((res) => res.json())
      .then((data: Produto[]) => {
        setProdutos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar produtos em destaque:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      {/* Banner de Boas-Vindas */}
      <div className="container mt-5">
        <h1>Bem-vindo à Saúde Animal Agro e Vet</h1>
        <p>
          Encontre os melhores produtos para o cuidado dos seus animais de
          estimação e para a agricultura.
        </p>
      </div>

      <div className="container-fluid p-0 position-relative">
        <div className="row g-0">
          <div className="col-12">
            <img
              src="/img/banner.png"
              alt="banner"
              className="img-fluid rounded-5"
            />
          </div>
        </div>
      </div>

      {/* Seção Mais Vendidos */}
      <div className="container my-5">
        <div className="d-flex align-items-center justify-content-center mb-4 border-bottom pb-3">
          <h2 className="fw-bold m-0 fs-3 text-dark text-uppercase destaque-vendas">
            🔥 Mais vendidos
          </h2>
        </div>

        {/* Feedback visual enquanto carrega a API */}
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {produtos.map((produto) => (
              <div key={produto.id} className="col-6 col-sm-6 col-md-3">
                <div className="card h-100 border-0 shadow bg-dark text-white position-relative">
                  <div className="p-3 bg-white d-flex align-items-center justify-content-center container-foto-produto">
                    <img
                      src={`/img/${produto.imagem}`}
                      className="img-fluid foto-produto"
                      alt={produto.nome}
                    />
                  </div>

                  <div className="card-body d-flex flex-column text-center">
                    <h5 className="card-title fs-6 text-uppercase mb-2 nome-produto">
                      {produto.nome}
                    </h5>

                    <p className="card-text fw-bold fs-5 mt-auto mb-2 preço-produto">
                      R${' '}
                      {Number(produto.preço).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>

                    <a
                      href={`/produtos/${produto.id}`}
                      className="btn btn-success btn-sm w-100 fw-bold py-2 text-uppercase mt-auto stretched-link"
                    >
                      Ver Produtos
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center my-5">
          <a
            href="/produtos"
            className="btn btn-outline-dark px-5 py-2 fw-bold text-uppercase"
          >
            Ver mais produtos
          </a>
        </div>
      </div>

      {/* Seção Nossa História */}
      <div className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold mb-3 text-start text-dark">
              Conheça nossa história
            </h2>
            <p className="text-start">
              Fundada em 2020, a Saúde Animal Agro e Vet nasceu do sonho de
              oferecer produtos de qualidade para o cuidado dos animais e para
              a agricultura. Com uma equipe apaixonada por animais e comprometida
              com a excelência, buscamos proporcionar a melhor experiência de
              compra para nossos clientes.
            </p>
            <p className="text-start">
              Desde o início, nosso foco tem sido a satisfação do cliente,
              oferecendo uma ampla variedade de produtos que atendem às
              necessidades de cada animal e agricultor. Com quatro lojas físicas
              estrategicamente localizadas, estamos sempre prontos para atender
              nossos clientes com dedicação e profissionalismo.
            </p>

            <div className="row mt-5 text-center">
              <div className="col-3 ms-5">
                <h2 className="text-warning fw-bold">7+</h2>
                <p className="text-uppercase">Anos</p>
              </div>

              <div className="col-3">
                <h2 className="text-warning fw-bold">4</h2>
                <p className="text-uppercase">LOJAS</p>
              </div>

              <div className="col-3">
                <h2 className="text-warning fw-bold">1000+</h2>
                <p className="text-uppercase">Produtos</p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <img
              className="img-fluid foto rounded-5"
              src="/img/colaboradores.jpeg"
              alt="Colaboradores"
            />
          </div>
        </div>
      </div>
    </main>
  );
}