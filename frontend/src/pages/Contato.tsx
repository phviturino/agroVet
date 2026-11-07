import React from 'react';

export default function Contato() {
  const lojas = [
    {
      nome: 'Loja de Rancho Alegre',
      whatsapp: 'https://api.whatsapp.com/send?phone=5544997050997&text=Ol%C3%A1%2C+gostaria+de+atendimento+na+loja+de+Rancho+Alegre.'
    },
    {
      nome: 'Loja de Boa Esperança',
      whatsapp: 'https://api.whatsapp.com/send?phone=5544998514080&text=Ol%C3%A1%2C+gostaria+de+atendimento+na+loja+de+Boa+Esperan%C3%A7a.'
    },
    {
      nome: 'Loja de Goioerê',
      whatsapp: 'https://api.whatsapp.com/send?phone=5544998396367&text=Ol%C3%A1%2C+gostaria+de+atendimento+na+loja+de+Goioer%C3%AA.'
    },
    {
      nome: 'Loja de Quarto Centenário',
      whatsapp: 'https://api.whatsapp.com/send?phone=554497474375&text=Ol%C3%A1%2C+gostaria+de+atendimento+na+loja+de+Quarto+Centen%C3%A1rio.'
    }
  ];

  return (
    <main className="container mt-5 mb-5 text-center">
      <div className="row justify-content-center">
        <div className="col-12">
          <h2 className="text-dark mb-3 fw-bold">Fale conosco pelo WhatsApp</h2>
          <p className="text-secondary mb-5">
            Selecione a unidade mais próxima de você para receber um atendimento personalizado:
          </p>

          <div className="row g-4 justify-content-center">
            {lojas.map((loja, index) => (
              <div key={index} className="col-12 col-sm-6 col-md-3">
                <div className="card h-100 shadow border-0 p-3 bg-dark text-white text-center">
                  <i className="bi bi-geo-alt-fill text-success fs-2 mb-3"></i>
                  <h5 className="fw-bold mb-2 text-uppercase">{loja.nome}</h5>

                  <a
                    href={loja.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success fw-bold py-2 text-uppercase mt-auto shadow btn-sm"
                  >
                    <i className="bi bi-whatsapp me-1"></i> Chamar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}