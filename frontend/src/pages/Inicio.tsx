
import { apiURL } from "../api/constante";
import { useEffect, useState } from "react";
import ProdutoCard from "../components/ProdutoCard";
import "./Inicio.css";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  imagem: string | null;
}

interface Avaliacao {
  id_produto: number;
  nota: number;
}

export default function Inicio() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Buscar produtos em destaque
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
        console.error(
          "Erro ao buscar produtos em destaque:",
          err
        );
        setProdutos([]);
      })
      .finally(() => {
        setLoading(false);
      });

    // Buscar avaliações dos produtos
    fetch(`${apiURL}/avaliacoes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar avaliações");
        }
        return res.json();
      })
      .then((data: Avaliacao[]) => {
        if (Array.isArray(data)) {
          setAvaliacoes(data);
        }
      })
      .catch((err) => {
        console.error(
          "Erro ao carregar avaliações:",
          err
        );
      });
  }, []);

  return (
    <div className="inicio-page">

      {/* APRESENTAÇÃO */}
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

      {/* BANNER */}
      <section className="inicio-banner container-fluid">
        <img
          src="/img/banner.png"
          alt="Saúde Animal Agro e Vet"
        />
      </section>

      {/* PRODUTOS EM DESTAQUE */}
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
            <a href="/produtos">
              {" "}Confira nosso catálogo.
            </a>
          </div>
        ) : (
          <div className="row row-cols-2 row-cols-md-4 g-4">
            {produtos.map((produto) => (
              <ProdutoCard
                key={produto.id}
                produto={{
                  id: produto.id,
                  nome: produto.nome,
                  preco: Number(produto.preco),
                  imagem: produto.imagem ?? "sem-imagem.png"
                }}
                avaliacoes={avaliacoes.filter(
                  (avaliacao) =>
                    Number(avaliacao.id_produto) === Number(produto.id)
                )}
              />
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

      {/* NOSSA HISTÓRIA */}
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
