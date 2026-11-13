
import { apiURL } from "../api/constante";
import { useEffect, useState } from "react";
import "./Inicio.css";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  imagem: string | null;
}

export default function Inicio() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const url = `${apiURL}/produtos/destaque`;

    fetch(`${apiURL}/produtos/destaque`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Falha ao carregar destaques");
        }
        return res.json();
      })
          .then((data: Produto[]) => {
            if (!Array.isArray(data)) {
              throw new Error("Resposta inválida da API");
            }

            setProdutos(data);
          })
          .catch((err) => {
            console.error("Erro ao buscar produtos em destaque:", err);
          })
          .finally(() => {
            setLoading(false);
          });
      }, []);

    return (
      <div className="inicio-page">

        {/* Apresentação */}
        <section className="inicio-apresentacao container">
          <span className="inicio-etiqueta">
            SAÚDE ANIMAL AGRO E VET
          </span>

          <h1>
            Tudo para o cuidado dos seus animais
            <span> e da sua produção.</span>
          </h1>

          <p>
            Qualidade, confiança e variedade para quem cuida dos animais
            e trabalha no campo.
          </p>
        </section>

        {/* Banner */}
        <section className="inicio-banner container-fluid">
          <img
            src="/img/banner.png"
            alt="Saúde Animal Agro e Vet"
          />
        </section>

        {/* Produtos em destaque */}
        <section className="container inicio-produtos">
          <div className="inicio-section-header">
            <div>
              <span className="inicio-etiqueta">
                NOSSOS DESTAQUES
              </span>
              <h2>Mais vendidos</h2>
              <p>
                Confira alguns dos produtos favoritos dos nossos clientes.
              </p>
            </div>

            <a href="/produtos" className="inicio-link">
              Ver catálogo <span>→</span>
            </a>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border inicio-spinner"
                role="status"
              >
                <span className="visually-hidden">
                  Carregando...
                </span>
              </div>
            </div>
          ) : produtos.length === 0 ? (
            <div className="inicio-vazio">
              Não foi possível carregar os produtos em destaque.
              <a href="/produtos"> Confira nosso catálogo.</a>
            </div>
          ) : (
            <div className="row g-4">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="col-6 col-md-4 col-lg-3"
                >
                  <article className="inicio-card h-100">
                    <a
                      href={`/produtos/${produto.id}`}
                      className="inicio-card-link"
                      aria-label={`Ver ${produto.nome}`}
                    >
                      <div className="inicio-card-imagem">
                        <img
                          src={
                            produto.imagem
                              ? `/img/${produto.imagem}`
                              : "/img/sem-imagem.png"
                          }
                          alt={produto.nome}
                          loading="lazy"
                        />
                      </div>

                      <div className="inicio-card-conteudo">
                        <h3>{produto.nome}</h3>

                        <p className="inicio-card-preco">
                          {Number(produto.preco).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                        </p>

                        <span className="inicio-card-botao">
                          Ver produto <span>→</span>
                        </span>
                      </div>
                    </a>
                  </article>
                </div>
              ))}
            </div>
          )}

          <div className="inicio-catalogo-cta">
            <a
              href="/produtos"
              className="inicio-botao-dourado"
            >
              Explorar catálogo
            </a>
          </div>
        </section>

        {/* Nossa história */}
        <section className="inicio-historia">
          <div className="container">
            <div className="row align-items-center g-5">

              <div className="col-lg-6">
                <span className="inicio-etiqueta">
                  QUEM SOMOS
                </span>

                <h2>Conheça nossa história</h2>

                <p>
                  Fundada em 2020, a Saúde Animal Agro e Vet
                  nasceu do sonho de oferecer produtos de
                  qualidade para o cuidado dos animais e
                  para a agricultura.
                </p>

                <p>
                  Desde o início, nosso foco tem sido a
                  satisfação dos clientes, oferecendo
                  variedade, dedicação e profissionalismo.
                  Com quatro lojas físicas, estamos sempre
                  prontos para atender você.
                </p>

                <div className="inicio-indicadores">
                  <div>
                    <strong>2020</strong>
                    <span>Fundação</span>
                  </div>

                  <div>
                    <strong>4</strong>
                    <span>Lojas físicas</span>
                  </div>

                  <div>
                    <strong>1000+</strong>
                    <span>Produtos</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="inicio-historia-imagem">
                  <img
                    src="/img/colaboradores.jpeg"
                    alt="Equipe da Saúde Animal Agro e Vet"
                    loading="lazy"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    );
  }
