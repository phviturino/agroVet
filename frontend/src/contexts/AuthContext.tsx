
import {
  createContext,
  useContext,
  useState,
  type ReactNode
} from "react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  carregarPerfil: () => Promise<void>;
  atualizarPerfil: (dados: {
    nome?: string;
    cpf?: string;
    telefone?: string;
    senha?: string;
    confirmarSenha?: string;
  }) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  async function carregarPerfil() {
    const token = localStorage.getItem("token");

    if (!token) {
      setUsuario(null);
      throw new Error("Usuário não autenticado!");
    }

    const resposta = await fetch("http://localhost:3001/api/perfil", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.mensagem || "Erro ao consultar perfil!");
    }

    setUsuario(dados.usuario);
  }

  async function atualizarPerfil(dadosAtualizados: {
    nome?: string;
    cpf?: string;
    telefone?: string;
    senha?: string;
    confirmarSenha?: string;
  }) {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Usuário não autenticado!");
    }

    const resposta = await fetch("http://localhost:3001/api/perfil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dadosAtualizados)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.mensagem || "Erro ao atualizar perfil!");
    }

    await carregarPerfil();

    return dados.mensagem;
  }

  return (
    <AuthContext.Provider
      value={{ usuario, carregarPerfil, atualizarPerfil }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve ser utilizado dentro de AuthProvider!");
  }

  return contexto;
}
