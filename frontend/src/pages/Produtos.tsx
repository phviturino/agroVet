
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiURL } from "../api/constante";
import ProdutoCard from "../components/ProdutoCard";
import Paginacao from "../components/Paginacao";
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

interface RespostaProdutos {
  dados: Produto[];
  paginacao: {
    paginaAtual: number;
    limite: number;
    totalRegistros: number;
    totalPaginas: number;
  };
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState("Todas");
  const [ordemDecrescente, setOrdemDecrescente] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const [searchParams] = useSearchParams();
  const termoBusca = searchParams.get("busca") || "";

  // Reinicia a paginação ao mudar a busca.
  useEffect(() => {
    setPaginaAtual(1);
    setCategoriaSelecionada("Todas");
  }, [termoBusca]);

  // Carrega todas as categorias disponíveis.
  useEffect(() => {
    let ativo = true;

    const carregarCategorias = async () => {
      try {
        const resposta = await fetch(`${apiURL}/categorias`);

        if (!resposta.ok) {
          throw new Error("Erro ao buscar categorias");
        }

        const dados: { nome: string }[] =
          await resposta.json();

        if (ativo && Array.isArray(dados)) {
          setCategorias(
            Array.from(
              new Set(
                dados
                  .map((categoria) => categoria.nome)
                  .filter(Boolean)
              )
            )
          );
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    carregarCategorias();

    return () => {
      ativo = false;
    };
  }, []);

  // Busca os produtos paginados no Back-End.
  useEffect(() => {
    let ativo = true;

    setLoading(true);
    setErro("");

    const carregarProdutos = async () => {
      try {
        const params = new URLSearchParams({
          page: String(paginaAtual),
          limit: "8",
          ordem: ordemDecrescente ? "desc" : "asc"
        });

        if (termoBusca) {
          params.set("busca", termoBusca);
        }

        if (categoriaSelecionada !== "Todas") {
          params.set("categoria", categoriaSelecionada);
        }

        const resposta = await fetch(
          `${apiURL}/produtos?${params.toString()}`
        );

        if (!resposta.ok) {
          throw new Error("Falha ao buscar produtos da API");
        }

        const dados: RespostaProdutos =
          await resposta.json();

        if (
          !Array.isArray(dados.dados) ||
          !dados.paginacao
        ) {
          throw new Error("Resposta inválida da API");
        }

        if (!ativo) return;

        setProdutos(dados.dados);
        setTotalPaginas(dados.paginacao.totalPaginas);
        setTotalRegistros(dados.paginacao.totalRegistros);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);

        if (ativo) {
          setProdutos([]);
          setTotalPaginas(0);
          setTotalRegistros(0);
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
  }, [
    termoBusca,
    paginaAtual,
    categoriaSelecionada,
    ordemDecrescente
  ]);

  // Carrega as avaliações dos produtos.
  useEffect(() => {
    let ativo = true;

    const carregarAvaliacoes = async () => {
      try {
        const resposta = await fetch(
          `${apiURL}/avaliacoes`
        );

        if (!resposta.ok) {
          throw new Error("Erro ao buscar avaliações");
        }

        const dados: Avaliacao[] = await resposta.json();

        if (ativo && Array.isArray(dados)) {
          setAvaliacoes(dados);
        }
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
      }
    };

    carregarAvaliacoes();

    return () => {
      ativo = false;
    };
  }, []);

  const mudarPagina = (pagina: number) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    setPaginaAtual(pagina);
  };

  const mudarCategoria = (categoria: string) => {
    setCategoriaSelecionada(categoria);
    setPaginaAtual(1);
  };

  const mudarOrdem = () => {
    setOrdemDecrescente((anterior) => !anterior);
    setPaginaAtual(1);
  };

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
                className={`produtos-categoria-btn ${categoriaSelecionada === categoria
                  ? "ativo"
                  : ""
                  }`}
                onClick={() => mudarCategoria(categoria)}
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
              onClick={mudarOrdem}
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
                : `${totalRegistros} produto(s) encontrado(s)`}
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
        ) : produtos.length === 0 ? (
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
            {produtos.map((produto) => (
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

        {!loading && !erro && (
          <Paginacao
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            aoMudarPagina={mudarPagina}
          />
        )}

      </div>
    </main>
  );
}
