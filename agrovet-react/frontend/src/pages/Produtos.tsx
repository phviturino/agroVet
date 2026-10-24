import React, { useEffect, useState } from 'react';

// Interfaces tipadas para o TypeScript
interface Produto {
  id: number;
  nome: string;
  preço: number;
  imagem: string;
  categoria?: string;
}

interface CategoriaStats {
  totalValor: number;
  destaque: string;
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todas');
  const [ordemDecrescente, setOrdemDecrescente] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<CategoriaStats>({ totalValor: 0, destaque: 'Geral' });

  // Pega o parâmetro "?busca=..." da URL do navegador
  const searchParams = new URLSearchParams(window.location.search);
  const termoBusca = searchParams.get('busca') || '';

  // 1. Busca os produtos da API Node.js/Express
  useEffect(() => {
    setLoading(true);

    const url = termoBusca
      ? `/api/produtos?busca=${encodeURIComponent(termoBusca)}`
      : '/api/produtos';

    fetch(url)
      .then((res) => res.json())
      .then((data: Produto[]) => {
        setProdutos(data);

        // Extrai as categorias únicas a partir dos produtos
        const catsUnicas = Array.from(
          new Set(data.map((p) => p.categoria).filter(Boolean))
        ) as string[];
        setCategorias(['Todas', ...catsUnicas]);

        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar produtos:', err);
        setLoading(false);
      });
  }, [termoBusca]);

  // 2. Filtra por categoria e ordena A-Z / Z-A
  const produtosFiltrados = produtos
    .filter((p) => {
      if (categoriaSelecionada === 'Todas') return true;
      return p.categoria === categoriaSelecionada;
    })
    .sort((a, b) => {
      if (ordemDecrescente) {
        return b.nome.localeCompare(a.nome);
      }
      return a.nome.localeCompare(b.nome);
    });

  // 3. Atualiza os cards de valor total e destaque da categoria
  useEffect(() => {
    const total = produtosFiltrados.reduce(
      (acc, p) => acc + Number(p.preço || 0),
      0
    );
    setStats({
      totalValor: total,
      destaque: categoriaSelecionada === 'Todas' ? 'Geral' : categoriaSelecionada,
    });
  }, [categoriaSelecionada, produtos]);

  return (
    <main className="container mt-5 mb-5">
      {/* Navegação de Categorias */}
      <div
        className="d-flex flex-wrap justify-content-center gap-2 mb-3"
        id="categorias-nav-links"
      >
        {categorias.map((cat, index) => (
          <button
            key={index}
            className={`btn btn-sm ${
              categoriaSelecionada === cat
                ? 'btn-success fw-bold'
                : 'btn-outline-secondary'
            }`}
            onClick={() => setCategoriaSelecionada(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards Informativos da Categoria */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="bg-light rounded p-3 text-center h-100 shadow-sm">
            <p className="text-muted mb-1 small">Valor total nessa categoria</p>
            <p id="total-categoria" className="fw-bold fs-5 m-0 text-dark">
              R${' '}
              {stats.totalValor.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="bg-warning bg-opacity-25 rounded p-3 text-center h-100 shadow-sm">
            <p className="text-muted mb-1 small">Categoria em destaque</p>
            <p id="categoria-destaque" className="fw-bold fs-5 m-0 text-dark">
              {stats.destaque}
            </p>
          </div>
        </div>
      </div>

      {/* Título do Catálogo */}
      <h2 className="text-center mb-4 text-dark catalogo-titulo">
        {termoBusca
          ? `Resultados para: "${termoBusca}"`
          : 'Todos os nossos produtos'}
      </h2>

      {/* Botão de Ordenação A-Z / Z-A */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          id="btn-ordenar"
          className="btn btn-outline-dark btn-sm fw-bold"
          onClick={() => setOrdemDecrescente(!ordemDecrescente)}
        >
          {ordemDecrescente ? 'Ordenar de A-z ⬆️' : 'Ordenar de Z-a ⬇️'}
        </button>

        <span className="text-muted small">
          {produtosFiltrados.length} produto(s) encontrado(s)
        </span>
      </div>

      {/* Grid de Produtos */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Carregando catálogo...</span>
          </div>
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="alert alert-info text-center my-5" role="alert">
          Nenhum produto encontrado para o filtro selecionado.
        </div>
      ) : (
        <div className="row row-cols-2 row-cols-md-4 g-4" id="lista-produtos">
          {produtosFiltrados.map((produto) => (
            <div key={produto.id} className="col">
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

                  <p className="card-text fw-bold fs-5 mt-auto mb-2 preço-produto text-warning">
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
    </main>
  );
}