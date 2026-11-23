
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiURL } from "../api/constante";
import ProdutoCard from "../components/ProdutoCard";
import "./Produtos.css";

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
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<string>("Todas");
  const [ordemDecrescente, setOrdemDecrescente] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string>("");
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  const [searchParams] = useSearchParams();
  const termoBusca = searchParams.get("busca") || "";

  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro("");
    setCategoriaSelecionada("Todas");

    const carregarProdutos = async () => {
      try {
        const url = termoBusca
          ? `${apiURL}/produtos?busca=${encodeURIComponent(termoBusca)}`
          : `${apiURL}/produtos`;

        const resposta = await fetch(url);

        if (!resposta.ok) {
          throw new Error("Falha ao buscar produtos da API");
        }

        const dados: Produto[] = await resposta.json();

        if (!Array.isArray(dados)) {
          throw new Error("Resposta inválida da API");
        }

        if (!ativo) return;

        setProdutos(dados);

        const categoriasUnicas = Array.from(
          new Set(
            dados
              .map((produto) => produto.categoria)
              .filter(
                (categoria): categoria is string =>
                  Boolean(categoria)
              )
          )
        );

        setCategorias(categoriasUnicas);
      } catch (erro) {
        console.error("Erro ao buscar produtos:", erro);

        if (ativo) {
          setProdutos([]);
          setCategorias([]);
          setErro("Não foi possível carregar o catálogo.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    };

    carregarProdutos();

    return () => {
      ativo = false;
    };
  }, [termoBusca]);

  useEffect(() => {
    let ativo = true;

    const carregarAvaliacoes = async () => {
      try {
        const resposta = await fetch(`${apiURL}/avaliacoes`);

        if (!resposta.ok) {
          throw new Error("Erro ao buscar avaliações");
        }

        const dados: Avaliacao[] = await resposta.json();

        if (ativo && Array.isArray(dados)) {
          setAvaliacoes(dados);
        }
      } catch (erro) {
        console.error("Erro ao carregar avaliações:", erro);
      }
    };

    carregarAvaliacoes();

    return () => {
      ativo = false;
    };
  }, []);

  const produtosFiltrados = produtos
    .filter((produto) => {
      if (categoriaSelecionada === "Todas") {
        return true;
      }

      return produto.categoria === categoriaSelecionada;
    })
    .sort((a, b) => {
      return ordemDecrescente
        ? b.nome.localeCompare(a.nome, "pt-BR")
        : a.nome.localeCompare(b.nome, "pt-BR");
    });

  return (
    <main className="produtos-page">
      <div className="container">

        {/* CABEÇALHO DO CATÁLOGO */}
        <section className="produtos-apresentacao">
          <span className="produtos-etiqueta">
            AGROVET • CATÁLOGO
          </span>

          <h1>
            {termoBusca
              ? `Resultados para "${termoBusca}"`
              : "Todos os nossos produtos"}
          </h1>

          <p>
            Qualidade e variedade para cuidar dos seus animais
            e da sua produção.
          </p>
        </section>

        {/* FILTROS POR CATEGORIA */}
        <section className="produtos-filtros">
          <div
            className="produtos-categorias"
            id="categorias-nav-links"
            aria-label="Filtrar por categoria"
          >
            {["Todas", ...categorias].map((categoria) => (
              <button
                key={categoria}
                type="button"
                className={`produtos-categoria-btn ${
                  categoriaSelecionada === categoria
                    ? "ativo"
                    : ""
                }`}
                onClick={() =>
                  setCategoriaSelecionada(categoria)
                }
                aria-pressed={
                  categoriaSelecionada === categoria
                }
              >
                {categoria}
              </button>
            ))}
          </div>

          {/* ORDENAÇÃO E QUANTIDADE */}
          <div className="produtos-barra">
            <button
              id="btn-ordenar"
              type="button"
              className="produtos-ordenar"
              onClick={() =>
                setOrdemDecrescente(!ordemDecrescente)
              }
            >
              <span aria-hidden="true">↕</span>
              {ordemDecrescente
                ? "Nome: Z–A"
                : "Nome: A–Z"}
              <span aria-hidden="true">⌄</span>
            </button>

            <span className="produtos-contagem">
              {loading
                ? "Carregando produtos..."
                : `${produtosFiltrados.length} produto(s) encontrado(s)`}
            </span>
          </div>
        </section>

        {/* LISTAGEM */}
        {loading ? (
          <div className="produtos-status">
            <div
              className="spinner-border produtos-spinner"
              role="status"
            >
              <span className="visually-hidden">
                Carregando catálogo...
              </span>
            </div>
          </div>
        ) : erro ? (
          <div className="produtos-vazio" role="alert">
            <h2>Ops! Algo deu errado.</h2>
            <p>{erro}</p>
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="produtos-vazio">
            <h2>Nenhum produto encontrado</h2>
            <p>
              Tente outra categoria ou um termo de busca diferente.
            </p>
          </div>
        ) : (
          <div
            className="row row-cols-2 row-cols-md-4 g-4"
            id="lista-produtos"
          >
            {produtosFiltrados.map((produto) => (
              <ProdutoCard
                key={produto.id}
                produto={produto}
                avaliacoes={avaliacoes.filter(
                  (avaliacao) =>
                    Number(avaliacao.id_produto) ===
                    Number(produto.id)
                )}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
