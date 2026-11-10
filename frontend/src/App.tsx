import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Produtos from './pages/Produtos';
import DetalheProduto from './pages/DetalheProduto';
import Contato from './pages/Contato';
import AdminIndex from './pages/admin/AdminIndex';
import WhatsAppFloat from "./components/WhatsAppFloat";
import Cadastro from './pages/Cadastro';
import Login from "./pages/Login";

export default function App() {

  const path = window.location.pathname;

  const renderPage = () => {

    if (path === '/admin') {
      return <AdminIndex />;
    }

    if (path === '/produtos') {
      return <Produtos />;
    }

    if (path.startsWith('/produtos/')) {
      return <DetalheProduto />;
    }

    if (path === '/contato') {
      return <Contato />;
    }

    if (path == '/cadastro') {
      return <Cadastro />;
    }
    if (path === "/login") {
      return <Login />;
    }

    return <Inicio />;
  };

  const isHome = path === '/' || path === '';

  if (path === '/admin') {
    return <AdminIndex />;
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light text-dark">
      <Header mostrarCatalogo={isHome} />

      <main className="flex-grow-1">
        {renderPage()}
      </main>

      <WhatsAppFloat />

      <Footer />
    </div>
  );
}