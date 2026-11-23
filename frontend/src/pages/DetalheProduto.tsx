
import { useEffect, useState } from "react";
import { apiURL } from "../api/constante";
import { api } from "../api/axios";
import { toast } from "react-toastify";
import FormularioAvaliacao from "../components/FormularioAvaliacao";
import "./DetalheProduto.css";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  descricao?: string;
  categoria?: string;
}

interface Avaliacao {
  id: number;
  id_produto: number;
  usuario: string;
  nota: number;
  comentario: string | null;
  criado_em: string;
}

export default function DetalheProduto() {
  const path = window.location.pathname;
  const id = path.split("/").filter(Boolean).pop();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let ativo = true;

    if (!id || !/^\d+$/.test(id) || Number(id) <= 0) {
      setErro("ID de produto inválido.");
      setProduto(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro(null);
    setProduto(null);
    setAvaliacoes([]);

    fetch(`${apiURL}/produtos/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Produto não encontrado");
        }
        return res.json();
      })
      .then((data: Produto) => {
        if (ativo) {
          setProduto(data);
          setErro(null);
        }
      })
      .catch((err) => {
        console.error(err);
        if (ativo) {
          setErro("Não foi possível carregar este produto.");
        }
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  useEffect(() => {
    let ativo = true;

    if (!id || !/^\d+$/.test(id) || Number(id) <= 0) {
      return;
    }

    fetch(`${apiURL}/avaliacoes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar avaliações");
        }
        return res.json();
      })
      .then((data: Avaliacao[]) => {
        if (ativo && Array.isArray(data)) {
          setAvaliacoes(
            data.filter(
              (avaliacao) =>
                Number(avaliacao.id_produto) === Number(id)
            )
          );
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar avaliações:", err);
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  const quantidadeAvaliacoes = avaliacoes.length;

  const mediaAvaliacoes =
    quantidadeAvaliacoes > 0
      ? avaliacoes.reduce(
        (soma, avaliacao) => soma + Number(avaliacao.nota),
        0
      ) / quantidadeAvaliacoes
      : 0;

  const enviarAvaliacao = async (
    nota: number,
    comentario: string
  ): Promise<boolean> => {
    if (!localStorage.getItem("token")) {
      toast.warning("Faça login para avaliar este produto.");
      return false;
    }

    if (nota < 1 || nota > 5) {
      toast.warning("Selecione de 1 a 5 estrelas.");
      return false;
    }

    setEnviando(true);

    try {
      await api.post("/avaliacoes", {
        id_produto: Number(id),
        nota,
        comentario: comentario.trim()
      });

      toast.success("Avaliação enviada com sucesso!");

      try {
        const resposta = await api.get<Avaliacao[]>("/avaliacoes");

        setAvaliacoes(
          resposta.data.filter(
            (avaliacao) =>
              Number(avaliacao.id_produto) === Number(id)
          )
        );
      } catch (erroAtualizacao) {
        console.error(
          "Avaliação salva, mas não foi possível atualizar a lista:",
          erroAtualizacao
        );
        toast.warning("Avaliação enviada, mas não foi possível atualizar os comentários.");
      }

      return true;
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      toast.error("Não foi possível enviar sua avaliação. Verifique seu login.");
      return false;
    } finally {
      setEnviando(false);
    }
  };

  const getWhatsAppLink = (nomeProduto: string) => {
    const mensagem = encodeURIComponent(
      `Olá! Gostaria de mais informações sobre o produto: ${nomeProduto}`
    );

    return `https://api.whatsapp.com/send?phone=5544998514080&text=${mensagem}`;
  };

  const renderEstrelas = (nota: number) => (
    <span className="detalhe-estrelas" aria-label={`${nota} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((estrela) => (
        <span
          key={estrela}
          className={
            estrela <= Math.round(nota)
              ? "detalhe-estrela-ativa"
              : "detalhe-estrela-inativa"
          }
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );

  if (loading) {
    return (
      <main className="detalhe-page">
        <div className="container detalhe-carregando">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">
              Carregando produto...
            </span>
          </div>
        </div>
      </main>
    );
  }

  if (erro || !produto) {
    return (
      <main className="detalhe-page">
        <div className="container">
          <div className="detalhe-erro text-center">
            <h2>Produto indisponível</h2>
            <p>{erro || "Produto não encontrado."}</p>
            <a href="/produtos" className="detalhe-voltar">
              ← Voltar ao catálogo
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="detalhe-page">
      <div className="container">
        <a href="/produtos" className="detalhe-voltar">
          ← Voltar ao catálogo
        </a>

        <section className="detalhe-produto">
          <div className="row g-4 g-lg-5 align-items-center">

            <div className="col-12 col-md-5">
              <div className="detalhe-imagem-box">
                <img
                  src={
                    produto.imagem
                      ? `/img/${produto.imagem}`
                      : "/img/sem-imagem.png"
                  }
                  alt={produto.nome}
                  className="img-fluid"
                />
              </div>
            </div>

            {/* INFORMAÇÕES */}
            <div className="col-12 col-md-7">
              <div className="detalhe-info">
                {produto.categoria && (
                  <span className="detalhe-categoria">
                    {produto.categoria}
                  </span>
                )}

                <h1 className="detalhe-titulo">
                  {produto.nome}
                </h1>

                <div className="detalhe-avaliacao-resumo">
                  {renderEstrelas(mediaAvaliacoes)}

                  <span className="detalhe-nota">
                    {quantidadeAvaliacoes > 0
                      ? mediaAvaliacoes
                        .toFixed(1)
                        .replace(".", ",")
                      : "Sem avaliações"}
                  </span>

                  <a href="#avaliacoes-produto" className="detalhe-link-avaliacoes">
                    ({quantidadeAvaliacoes} avaliações)
                  </a>
                </div>

                <div className="detalhe-divisor" />

                <div className="detalhe-descricao">
                  <h2>Sobre este produto</h2>
                  <p>
                    {produto.descricao ||
                      "Produto de alta qualidade disponível para pronta entrega nas nossas lojas."}
                  </p>
                </div>

                <div className="detalhe-divisor" />

                <div className="detalhe-compra">
                  <span className="detalhe-preco-label">
                    Preço
                  </span>

                  <div className="detalhe-preco">
                    {Number(produto.preco).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL"
                      }
                    )}
                  </div>

                  <a
                    href={getWhatsAppLink(produto.nome)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detalhe-whatsapp"
                  >
                    <i className="bi bi-whatsapp" aria-hidden="true"></i>
                    Peça via WhatsApp
                  </a>

                  <p className="detalhe-ajuda">
                    Fale com nossa equipe para saber mais
                    sobre este produto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AVALIAÇÕES */}
        <section
          id="avaliacoes-produto"
          className="detalhe-avaliacoes"
        >
          <div className="detalhe-secao-cabecalho">
            <div>
              <span className="detalhe-secao-etiqueta">
                OPINIÃO DOS CLIENTES
              </span>
              <h2>Avaliações do produto</h2>
            </div>

            <div className="detalhe-media-box">
              <strong>
                {quantidadeAvaliacoes > 0
                  ? mediaAvaliacoes
                    .toFixed(1)
                    .replace(".", ",")
                  : "—"}
              </strong>
              <div>
                {renderEstrelas(mediaAvaliacoes)}
                <span>
                  {quantidadeAvaliacoes} avaliação(ões)
                </span>
              </div>
            </div>
          </div>

          <div className="detalhe-avaliacoes-conteudo">
            {/* COMENTÁRIOS */}
            <div className="detalhe-comentarios">
              <h3>O que nossos clientes dizem</h3>

              {quantidadeAvaliacoes === 0 ? (
                <div className="detalhe-sem-avaliacoes">
                  <p>
                    Este produto ainda não possui avaliações.
                    Seja o primeiro a avaliar!
                  </p>
                </div>
              ) : (
                avaliacoes.map((avaliacao) => (
                  <article
                    key={avaliacao.id}
                    className="detalhe-comentario"
                  >
                    <div className="detalhe-comentario-topo">
                      <strong>{avaliacao.usuario}</strong>

                      <time>
                        {new Date(
                          avaliacao.criado_em
                        ).toLocaleDateString("pt-BR")}
                      </time>
                    </div>

                    {renderEstrelas(Number(avaliacao.nota))}

                    {avaliacao.comentario && (
                      <p>{avaliacao.comentario}</p>
                    )}
                  </article>
                ))
              )}
            </div>

            {/* FORMULÁRIO */}
            <div className="detalhe-formulario-area">
              <FormularioAvaliacao
                onEnviar={enviarAvaliacao}
                enviando={enviando}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
