
import "./Contato.css";

interface Loja {
  nome: string;
  cidade: string;
  endereco: string;
  telefone: string;
}

const lojas: Loja[] = [
  {
    nome: "Rancho Alegre D'Oeste",
    cidade: "Rancho Alegre D'Oeste",
    endereco: "Av. Paraná, Centro, 566",
    telefone: "5544997050997"
  },
  {
    nome: "Boa Esperança",
    cidade: "Boa Esperança",
    endereco: "Rua Bahia, Centro, 354",
    telefone: "5544998514080"
  },
  {
    nome: "Goioerê",
    cidade: "Goioerê",
    endereco: "Rua Marinho Taváres, 815",
    telefone: "5544998396367"
  },
  {
    nome: "Quarto Centenário",
    cidade: "Quarto Centenário",
    endereco: "Av. Bandeirantes, 670",
    telefone: "554497474375"
  }
];

export default function Contato() {
  function gerarLinkWhatsApp(loja: Loja) {
    const mensagem = encodeURIComponent(
      `Olá, gostaria de atendimento na loja de ${loja.cidade}.`
    );

    return `https://api.whatsapp.com/send?phone=${loja.telefone}&text=${mensagem}`;
  }

  return (
    <main className="contato-page">

      {/* CABEÇALHO */}
      <section className="contato-hero">
        <div className="container">
          <span className="contato-etiqueta">
            ESTAMOS AQUI PARA AJUDAR
          </span>

          <h1>
            Vamos conversar<span>?</span>
          </h1>

          <p>
            Nossa equipe está pronta para ajudar você a
            encontrar os melhores produtos para seus
            animais e sua propriedade.
          </p>

          <div className="contato-hero-detalhe">
            <i
              className="bi bi-whatsapp"
              aria-hidden="true"
            ></i>
            Atendimento direto pelo WhatsApp
          </div>
        </div>
      </section>

      {/* UNIDADES */}
      <section className="contato-unidades">
        <div className="container">

          <div className="contato-secao-topo">
            <span className="contato-etiqueta">
              NOSSAS UNIDADES
            </span>

            <h2>Escolha a loja mais próxima</h2>

            <p>
              Selecione uma de nossas quatro unidades
              para falar diretamente com a equipe.
            </p>
          </div>

          <div className="contato-grid">
            {lojas.map((loja, index) => (
              <article
                key={loja.telefone}
                className="contato-card"
              >
                <div className="contato-card-topo">
                  <div className="contato-card-icone">
                    <i
                      className="bi bi-geo-alt"
                      aria-hidden="true"
                    ></i>
                  </div>

                  <span className="contato-card-numero">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <span className="contato-card-etiqueta">
                  UNIDADE AGRO & VET
                </span>

                <h3>{loja.nome}</h3>

                <div className="contato-card-endereco">
                  <i
                    className="bi bi-pin-map"
                    aria-hidden="true"
                  ></i>
                  <span>{loja.endereco} - PR</span>
                </div>

                <div className="contato-card-divisor" />

                <a
                  href={gerarLinkWhatsApp(loja)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contato-card-botao"
                  aria-label={`Conversar com a loja de ${loja.nome} pelo WhatsApp`}
                >
                  <i
                    className="bi bi-whatsapp"
                    aria-hidden="true"
                  ></i>

                  Falar com a loja

                  <i
                    className="bi bi-arrow-up-right"
                    aria-hidden="true"
                  ></i>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO ADICIONAL */}
      <section className="contato-adicional">
        <div className="container">
          <div className="contato-adicional-conteudo">
            <div>
              <span className="contato-etiqueta">
                CONTINUE CONECTADO
              </span>

              <h2>Estamos também nas redes sociais.</h2>

              <p>
                Acompanhe nossas novidades, produtos e
                informações pelos nossos canais oficiais.
              </p>
            </div>

            <div className="contato-adicional-links">
              <a
                href="https://www.instagram.com/saudeanimalagroevet/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="bi bi-instagram"
                  aria-hidden="true"
                ></i>
                Instagram
              </a>

              <a href="mailto:saudeanimalagroevet@outlook.com.br">
                <i
                  className="bi bi-envelope"
                  aria-hidden="true"
                ></i>
                Enviar e-mail
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
