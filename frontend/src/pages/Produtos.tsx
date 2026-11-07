import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Produto {
  id: number;
  nome: string;
  preço: number;
  imagem: string;
  categoria?: string;
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todas');
  const [ordemDecrescente, setOrdemDecrescente] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = new URLSearchParams(window.location.search);
  const termoBusca = searchParams.get('busca') || '';

  useEffect(() => {
    setLoading(true);

    const baseUrl = 'http://localhost:3001/api/produtos';
    const url = termoBusca
      ? `${baseUrl}?busca=${encodeURIComponent(termoBusca)}`
      : baseUrl;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Falha ao buscar produtos da API');
        }
        return res.json();
      })
      .then((data: Produto[]) => {
        setProdutos(data);

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

  return (
    <main className="container mt-5 mb-5">

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

      <h2 className="text-center mb-4 text-dark catalogo-titulo">
        {termoBusca
          ? `Resultados para: "${termoBusca}"`
          : 'Todos os nossos produtos'}
      </h2>

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
                    Ver Produto
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