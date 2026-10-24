import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Produtos from './pages/Produtos';
import Contato from './pages/Contato';

export function App() {
  // Pega a rota atual do navegador (ex: "/", "/produtos", "/contato")
  const path = window.location.pathname;

  // Renderiza a página baseada no caminho da URL
  const renderPage = () => {
    switch (path) {
      case '/produtos':
        return <Produtos />;
      case '/contato':
        return <Contato />;
      case '/':
      default:
        return <Inicio />;
    }
  };

  const isHome = path === '/' || path === '';

  return (
    <div className="d-flex flex-column min-vh-100 bg-light text-dark">
      {/* Exibe o catálogo no Header apenas se estiver na página inicial */}
      <Header mostrarCatalogo={isHome} />

      {/* Conteúdo dinâmico da página */}
      <main className="flex-grow-1">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
}

export default App;