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
import Perfil from "./pages/Perfil";
import AdminRoute from './components/AdminRoute';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {

  const notificacoes = (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="light"
      limit={3}
    />
  );

  const path = window.location.pathname;

  const renderPage = () => {

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
    if (path === '/perfil') {
      return <Perfil />;
    }

    return <Inicio />;
  };

  const isHome = path === '/' || path === '';

  if (path === '/admin') {
    return (
      <>
      <AdminRoute>
        <AdminIndex />
      </AdminRoute>

      {notificacoes}
      </>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light text-dark">
      <Header mostrarCatalogo={isHome} />

      <main className="flex-grow-1">
        {renderPage()}
      </main>

      <WhatsAppFloat />

      <Footer />

      {notificacoes}
    </div>
  );
}