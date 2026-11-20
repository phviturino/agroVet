import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiURL } from '../api/constante';
import ProdutoCard from '../components/ProdutoCard';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  categoria?: string;
}

interface Avaliacao {
  id_produto: number;
  nota: number;
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todas');
  const [ordemDecrescente, setOrdemDecrescente] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = new URLSearchParams(window.location.search);
  const termoBusca = searchParams.get('busca') || '';

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  useEffect(() => {
    setLoading(true);

    fetch(`${apiURL}/avaliacoes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar avaliações");
        }
        return res.json();
      })
      .then((data: Avaliacao[]) => {
        setAvaliacoes(data);
      })
      .catch((erro) => {
        console.error("Erro ao carregar avaliações:", erro);
      });

    const url = termoBusca
      ? `${apiURL}/produtos?busca=${encodeURIComponent(termoBusca)}`
      : `${apiURL}/produtos`;

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
            className={`btn btn-sm ${categoriaSelecionada === cat
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
            <ProdutoCard
              key={produto.id}
              produto={produto}
              avaliacoes={avaliacoes.filter(
                (avaliacao) => avaliacao.id_produto === produto.id
              )}
            />
          ))}
        </div>
      )}
    </main>
  );
}