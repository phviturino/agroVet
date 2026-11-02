import React, { useState } from "react";

interface HeaderProps {
  mostrarCatalogo?: boolean;
}

export default function Header({ mostrarCatalogo = false }: HeaderProps) {
  const [busca, setBusca] = useState("");

  function handleBusca(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const termo = busca.trim();

    if (!termo) {
      window.location.href = "/produtos";
      return;
    }

    window.location.href = `/produtos?busca=${encodeURIComponent(termo)}`;
  }

  return (
    <header>
      <nav className="navbar-dark py-3">
        <div className="container-fluid px-3">
          {/* Logo para dispositivos móveis */}
          <div className="d-flex justify-content-center mb-3 d-md-none">
            <a className="logo" href="/">
              <img
                src="/img/lojaicone.jpeg"
                alt="Saúde Animal Agro e Vet"
                className="logo-img-mobile"
              />
            </a>
          </div>

          {/* Cabeçalho para telas médias e grandes */}
          <div className="row align-items-center d-none d-md-flex">
            <div className="col-md-3">
              <a className="logo" href="/">
                <img
                  src="/img/lojaicone.jpeg"
                  alt="Saúde Animal Agro e Vet"
                  className="logo-img"
                />
              </a>
            </div>

            <div className="col-md-6">
              <form
                onSubmit={handleBusca}
                className="d-flex busca"
                role="search"
              >
                <input
                  className="form-control me-2 w-100"
                  type="search"
                  name="busca"
                  placeholder="Buscar"
                  aria-label="Buscar produtos"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                />

                <button
                  className="btn btn-outline-success"
                  type="submit"
                  aria-label="Pesquisar"
                >
                  <i className="bi bi-search"></i>
                </button>
              </form>
            </div>

            <div className="col-md-3">
              <div className="d-flex align-items-center justify-content-end info-contato">
                <a href="/contato" className="btn-contato">
                  <i className="bi bi-whatsapp"></i> Fale conosco
                </a>
              </div>
            </div>
          </div>

          {/* Busca e contato para dispositivos móveis */}
          <div className="d-md-none d-flex align-items-center">
            <form
              onSubmit={handleBusca}
              className="d-flex flex-grow-1"
              role="search"
            >
              <input
                className="form-control me-2"
                type="search"
                name="busca"
                placeholder="Buscar Produto"
                aria-label="Buscar produtos"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
              />

              <button
                className="btn btn-outline-success px-3"
                type="submit"
                aria-label="Pesquisar"
              >
                <i className="bi bi-search"></i>
              </button>
            </form>

            <a
              href="/contato"
              className="btn-contato-mobile ms-2"
              aria-label="Fale conosco pelo WhatsApp"
            >
              <i className="bi bi-whatsapp"></i>
            </a>
          </div>
        </div>
      </nav>

      {/* Botão do catálogo exibido somente quando solicitado */}
      {mostrarCatalogo && (
        <div className="menu-nav text-center mb-3">
          <div className="mb-3">
            <a
              href="/produtos"
              className="btn btn-warning btn-lg fw-bold px-5 py-3 text-dark text-uppercase rounded-pill shadow-lg btn-banner-home"
            >
              🛒 VEJA NOSSO CATÁLOGO
            </a>
          </div>

          <hr className="w-50 mx-auto my-3 text-secondary" />
        </div>
      )}
    </header>
  );
}