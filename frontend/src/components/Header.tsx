
import { useState, type FormEvent } from "react";
import "./Header.css";

interface HeaderProps {
  mostrarCatalogo?: boolean;
}

export default function Header({
  mostrarCatalogo = false
}: HeaderProps) {
  const [busca, setBusca] = useState("");
  const estaLogado = Boolean(localStorage.getItem("token"));

  function handleBusca(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const termo = busca.trim();

    window.location.href = termo
      ? `/produtos?busca=${encodeURIComponent(termo)}`
      : "/produtos";
  }

  return (
    <header className="agro-header">
      <div className="container">
        <div className="agro-header-conteudo">

          <a
            href="/"
            className="agro-header-marca"
            aria-label="Ir para a página inicial"
          >
            <img
              src="/img/lojaicone.jpeg"
              alt="Saúde Animal Agro e Vet"
              className="agro-header-logo"
            />

            <div className="agro-header-marca-texto">
              <strong>SAÚDE ANIMAL</strong>
              <span>AGRO & VET</span>
            </div>
          </a>

          <form
            className="agro-header-busca"
            onSubmit={handleBusca}
            role="search"
          >
            <i
              className="bi bi-search agro-header-busca-icone"
              aria-hidden="true"
            ></i>

            <input
              type="search"
              name="busca"
              placeholder="O que você está procurando?"
              aria-label="Buscar produtos"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />

            <button type="submit">
              Buscar
            </button>
          </form>

          <div className="agro-header-acoes">
            {estaLogado ? (
              <a
                href="/perfil"
                className="agro-header-conta"
                title="Meu perfil"
              >
                <i
                  className="bi bi-person-circle"
                  aria-hidden="true"
                ></i>
                <span>Minha conta</span>
              </a>
            ) : (
              <a
                href="/cadastro"
                className="agro-header-conta"
                title="Criar conta"
              >
                <i
                  className="bi bi-person-circle"
                  aria-hidden="true"
                ></i>
                <span>Criar conta</span>
              </a>
            )}
          </div>

        </div>
      </div>

      <nav className="agro-header-navegacao" aria-label="Navegação principal">
        <div className="container">
          <div className="agro-header-links">
            <a href="/">
              <i className="bi bi-house-door" aria-hidden="true"></i>
              Início
            </a>

            <a href="/produtos">
              <i className="bi bi-grid" aria-hidden="true"></i>
              Produtos
            </a>

            <a href="/contato">
              <i className="bi bi-chat-dots" aria-hidden="true"></i>
              Contato
            </a>

            {!estaLogado && (
              <a href="/login">
                <i className="bi bi-box-arrow-in-right" aria-hidden="true"></i>
                Entrar
              </a>
            )}
          </div>
        </div>
      </nav>

      {mostrarCatalogo && (
        <div className="agro-header-catalogo">
          <a href="/produtos" className="agro-header-catalogo-btn">
            <i className="bi bi-bag-check" aria-hidden="true"></i>
            Explore nosso catálogo
            <i className="bi bi-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
      )}
    </header>
  );
}
