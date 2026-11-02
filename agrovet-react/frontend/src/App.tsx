import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Produtos from './pages/Produtos';
import DetalheProduto from './pages/DetalheProduto';
import Contato from './pages/Contato';
import AdminIndex from './pages/admin/AdminIndex';

export default function App() {
  // Pega a rota atual do navegador
  const path = window.location.pathname;

  // Renderiza a página baseada no caminho da URL
  const renderPage = () => {
    // 1. Rota do Painel Admin
    if (path === '/admin') {
      return <AdminIndex />;
    }

    // 2. Se a URL for exatamente "/produtos"
    if (path === '/produtos') {
      return <Produtos />;
    }

    // 3. Se a URL começar por "/produtos/" (ex: /produtos/1, /produtos/2)
    if (path.startsWith('/produtos/')) {
      return <DetalheProduto />;
    }

    // 4. Se a URL for "/contato"
    if (path === '/contato') {
      return <Contato />;
    }

    // 5. Página Inicial (padrão)
    return <Inicio />;
  };

  const isHome = path === '/' || path === '';

  // Se estiver na tela /admin, renderiza o painel limpo sem o Header/Footer do site
  if (path === '/admin') {
    return <AdminIndex />;
  }

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