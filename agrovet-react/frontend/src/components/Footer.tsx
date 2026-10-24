import React from 'react';

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

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        {/* Banner Superior e Descrição */}
        <div className="row align-items-center mb-3">
          <div className="col-md-3">
            <img
              src="/img/lojaicone.jpeg"
              alt="Saúde Animal Agro e Vet"
              className="logo-footer rounded-circle w-100"
            />
          </div>

          <div className="col-md-9">
            <p className="text-secondary ms-3">
              Sua loja completa, dedicada ao cuidado, desde o seu pet até
              sua fazenda. 4 lojas oferecendo o melhor a nossos clientes.
            </p>
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Lista das 4 Lojas */}
        <div className="row py-4">
          {LOJAS.map((loja, index) => (
            <div key={index} className="col-12 col-md-6 mb-4">
              <div className="footer-loja">
                <h6 className="text-warning text-uppercase fw-bold">
                  {loja.cidade}
                </h6>
                <p className="text-secondary small">{loja.endereco}</p>
                <a
                  href={`https://api.whatsapp.com/send?phone=${loja.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-success text-decoration-none"
                >
                  <i className="bi bi-whatsapp"></i> Whatsapp
                </a>
              </div>
            </div>
          ))}

          {/* Redes Sociais e E-mail */}
          <div className="footer-contato py-3 d-flex flex-wrap gap-3">
            <a
              href="https://www.instagram.com/saudeanimalagroevet/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-white me-3"
            >
              <i className="bi bi-instagram fs-5 me-2 text-center"></i>
              @saudeanimalagroevet
            </a>

            <a
              href="mailto:saudeanimalagroevet@outlook.com.br"
              className="text-decoration-none text-white"
            >
              <i className="bi bi-envelope fs-5 me-2 text-center"></i>
              saudeanimalagroevet@outlook.com.br
            </a>
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Direitos Reservados */}
        <div className="footer-redes py-3">
          <p className="text-secondary small mb-0 text-center">
            ©2026 Saúde Animal Agro e Vet - Todos os direitos reservados
          </p>
        </div>

        <div className="text-center mt-4">
          <img
            src="/img/img-footer.png"
            className="img-footer"
            alt="Saúde Animal"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;