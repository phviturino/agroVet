
import { useEffect, useState } from "react";
import { apiURL } from "../api/constante";
import { api } from "../api/axios";
import FormularioAvaliacao from "../components/FormularioAvaliacao";

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
  const [mensagemAvaliacao, setMensagemAvaliacao] = useState("");

  // Buscar produto
  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setErro("ID de produto inválido.");
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`${apiURL}/produtos/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Produto não encontrado");
        }
        return res.json();
      })
      .then((data: Produto) => {
        setProduto(data);
        setErro(null);
      })
      .catch((err) => {
        console.error(err);
        setErro("Não foi possível carregar este produto.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Buscar avaliações
  useEffect(() => {
    if (!id || isNaN(Number(id))) return;

    fetch(`${apiURL}/avaliacoes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar avaliações");
        }
        return res.json();
      })
      .then((data: Avaliacao[]) => {
        setAvaliacoes(
          data.filter(
            (avaliacao) =>
              Number(avaliacao.id_produto) === Number(id)
          )
        );
      })
      .catch((err) => {
        console.error("Erro ao carregar avaliações:", err);
      });
  }, [id]);

  // Calcular média das avaliações
  const quantidadeAvaliacoes = avaliacoes.length;

  const mediaAvaliacoes =
    quantidadeAvaliacoes > 0
      ? avaliacoes.reduce(
          (soma, avaliacao) => soma + Number(avaliacao.nota),
          0
        ) / quantidadeAvaliacoes
      : 0;

  // Enviar avaliação com JWT
  const enviarAvaliacao = async (
    nota: number,
    comentario: string
  ): Promise<boolean> => {
    if (!localStorage.getItem("token")) {
      setMensagemAvaliacao("Faça login para avaliar este produto.");
      return false;
    }

    if (nota < 1 || nota > 5) {
      setMensagemAvaliacao("Selecione de 1 a 5 estrelas.");
      return false;
    }

    setEnviando(true);
    setMensagemAvaliacao("");

    try {
      await api.post("/avaliacoes", {
        id_produto: Number(id),
        nota,
        comentario: comentario.trim()
      });

      // A avaliação já foi salva com sucesso
      setMensagemAvaliacao("Avaliação enviada com sucesso!");

      // Atualizar avaliações na tela
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
      }

      return true;
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);

      setMensagemAvaliacao(
        "Não foi possível enviar sua avaliação. Verifique seu login."
      );

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

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">
            Carregando produto...
          </span>
        </div>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-warning py-4 shadow-sm">
          <h4 className="fw-bold">Atenção</h4>
          <p className="mb-0">
            {erro || "Produto não encontrado."}
          </p>
        </div>

        <a
          href="/produtos"
          className="btn btn-outline-dark fw-bold mt-3"
        >
          ← Voltar para o Catálogo
        </a>
      </div>
    );
  }

  return (
    <main className="container my-5">
      <a
        href="/produtos"
        className="btn btn-outline-secondary btn-sm mb-4 fw-bold"
      >
        ← Voltar aos produtos
      </a>

      {/* CARD PRINCIPAL */}
      <div className="card border-0 shadow bg-dark text-white p-4">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-5 text-center bg-white p-4 rounded">
            <img
              src={`/img/${produto.imagem}`}
              alt={produto.nome}
              className="img-fluid object-fit-contain"
              style={{ maxHeight: "350px" }}
            />
          </div>

          <div className="col-12 col-md-7 d-flex flex-column">
            {produto.categoria && (
              <span className="badge bg-success mb-2 align-self-start fs-6">
                {produto.categoria}
              </span>
            )}

            <h2 className="fw-bold mb-3">
              {produto.nome}
            </h2>

            {/* ESTRELAS INFORMATIVAS - SEM CLIQUE */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="fw-bold">
                {quantidadeAvaliacoes > 0
                  ? mediaAvaliacoes.toFixed(1).replace(".", ",")
                  : "Sem avaliações"}
              </span>

              <div className="d-flex gap-1">
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <span
                    key={estrela}
                    style={{
                      color:
                        estrela <= Math.round(mediaAvaliacoes)
                          ? "#3483fa"
                          : "#6c757d",
                      fontSize: "22px"
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <span className="text-white-50">
                ({quantidadeAvaliacoes})
              </span>
            </div>

            <p className="text-secondary fs-6 mb-4">
              {produto.descricao ||
                "Produto de alta qualidade disponível para pronta entrega nas nossas lojas."}
            </p>

            <div className="mt-auto">
              <h3 className="text-warning fw-bold mb-3">
                R${" "}
                {Number(produto.preco).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </h3>

              <a
                href={getWhatsAppLink(produto.nome)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success btn-lg w-100 fw-bold py-3 text-uppercase shadow"
              >
                <i className="bi bi-whatsapp me-2"></i>
                Peça via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* AVALIAÇÕES ABAIXO DO CARD */}
      <section
        id="avaliacoes-produto"
        className="card border-0 shadow bg-dark text-white p-4 mt-4"
      >
        <h3 className="fw-bold mb-4">
          Avaliações dos clientes
        </h3>

        {/* COMENTÁRIOS */}
        {quantidadeAvaliacoes === 0 ? (
          <p className="text-white-50">
            Este produto ainda não possui avaliações.
            Seja o primeiro a avaliar!
          </p>
        ) : (
          <div className="mb-4">
            {avaliacoes.map((avaliacao) => (
              <div
                key={avaliacao.id}
                className="border-bottom border-secondary pb-3 mb-3"
              >
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <strong>{avaliacao.usuario}</strong>

                  <small className="text-white-50">
                    {new Date(
                      avaliacao.criado_em
                    ).toLocaleDateString("pt-BR")}
                  </small>
                </div>

                <div className="my-2">
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <span
                      key={estrela}
                      style={{
                        color:
                          estrela <= avaliacao.nota
                            ? "#FF9B36"
                            : "#6c757d",
                        fontSize: "20px"
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {avaliacao.comentario && (
                  <p className="mb-0">
                    {avaliacao.comentario}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* COMPONENTE SEPARADO */}
        <FormularioAvaliacao
          onEnviar={enviarAvaliacao}
          enviando={enviando}
          mensagem={mensagemAvaliacao}
        />
      </section>
    </main>
  );
}
