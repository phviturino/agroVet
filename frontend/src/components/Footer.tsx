
import "./Footer.css";

interface Loja {
  cidade: string;
  endereco: string;
  whatsapp: string;
}

const LOJAS: Loja[] = [
  {
    cidade: "Rancho Alegre D'Oeste",
    endereco: "Av. Paraná, centro, 566 - 87395-000 - PR",
    whatsapp: "5544997050997"
  },
  {
    cidade: "Boa Esperança",
    endereco: "Rua Bahia, centro, 354 - 87390-000 - PR",
    whatsapp: "5544998514080"
  },
  {
    cidade: "Goioerê",
    endereco: "Rua Marinho Taváres, 815 - 87360-000 - PR",
    whatsapp: "5544998396367"
  },
  {
    cidade: "Quarto Centenário",
    endereco: "Av. Bandeirantes, 670 - 87365-000 - PR",
    whatsapp: "554497474375"
  }
];

export default function Footer() {
  return (
    <footer className="agro-footer">
      <div className="container">

        <div className="agro-footer-topo">
          <div className="agro-footer-identidade">
            <a href="/" aria-label="Voltar ao início">
              <img
                src="/img/lojaicone.jpeg"
                alt="Saúde Animal Agro e Vet"
                className="agro-footer-logo"
              />
            </a>

            <div>
              <span className="agro-footer-etiqueta">
                SAÚDE ANIMAL AGRO & VET
              </span>

              <h2>Cuidando de quem importa.</h2>

              <p>
                Do seu pet à sua fazenda, oferecemos
                produtos e atendimento para quem cuida
                dos animais e trabalha no campo.
              </p>
            </div>
          </div>

          <div className="agro-footer-redes">
            <span className="agro-footer-etiqueta">
              FALE COM A GENTE
            </span>

            <a
              href="https://www.instagram.com/saudeanimalagroevet/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-instagram" aria-hidden="true"></i>
              <span>Instagram</span>
            </a>

            <a href="mailto:saudeanimalagroevet@outlook.com.br">
              <i className="bi bi-envelope" aria-hidden="true"></i>
              <span>E-mail</span>
            </a>
          </div>
        </div>

        <div className="agro-footer-divisor" />

        <div className="agro-footer-lojas-topo">
          <div>
            <span className="agro-footer-etiqueta">
              ONDE ESTAMOS
            </span>
            <h3>Encontre uma de nossas lojas</h3>
          </div>

          <span className="agro-footer-total">
            04 unidades
          </span>
        </div>

        <div className="agro-footer-lojas">
          {LOJAS.map((loja) => (
            <article
              key={loja.cidade}
              className="agro-footer-loja"
            >
              <div className="agro-footer-loja-icone">
                <i
                  className="bi bi-geo-alt"
                  aria-hidden="true"
                ></i>
              </div>

              <h4>{loja.cidade}</h4>

              <p>{loja.endereco}</p>

              <a
                href={`https://api.whatsapp.com/send?phone=${loja.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="agro-footer-whatsapp"
                aria-label={`Conversar com a loja de ${loja.cidade} pelo WhatsApp`}
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

        <div className="agro-footer-divisor" />

        <div className="agro-footer-inferior">
          <p>
            © {new Date().getFullYear()} Saúde Animal Agro e Vet.
            Todos os direitos reservados.
          </p>

          <div className="agro-footer-links">
            <a href="/">Início</a>
            <a href="/produtos">Produtos</a>
            <a href="/contato">Contato</a>
          </div>
        </div>

        <div className="agro-footer-imagem-final">
          <img
            src="/img/img-footer.png"
            alt="Saúde Animal"
          />
        </div>
      </div>
    </footer>
  );
}
