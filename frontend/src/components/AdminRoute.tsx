
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [status, setStatus] = useState<"verificando" | "autorizado" | "negado">("verificando");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");

    if (!token) {
      setMensagem("Você precisa fazer login para acessar esta área.");
      setStatus("negado");
      return;
    }

    async function verificarPermissao() {
      try {
        const resposta = await fetch("/api/admin/verificar", {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        });

        if (resposta.ok) {
          setStatus("autorizado");
          return;
        }

        if (resposta.status === 403) {
          setMensagem("Acesso restrito! Esta área é exclusiva para administradores.");
        } else if (resposta.status === 401) {
          setMensagem("Sua sessão é inválida ou expirou. Faça login novamente.");
        } else {
          setMensagem("Não foi possível verificar sua permissão.");
        }

        setStatus("negado");
      } catch {
        if (!controller.signal.aborted) {
          setMensagem("Erro de conexão ao verificar sua permissão.");
          setStatus("negado");
        }
      }
    }

    verificarPermissao();

    return () => controller.abort();
  }, []);

  if (status === "verificando") {
    return <p className="text-center mt-5">Verificando permissões...</p>;
  }

  if (status === "negado") {
    return (
      <div className="container text-center mt-5">
        <h2>Acesso negado</h2>
        <p>{mensagem}</p>
        <a href="/" className="btn btn-primary">
          Voltar ao início
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
