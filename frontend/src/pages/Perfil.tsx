
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Perfil() {
  const { usuario, carregarPerfil, atualizarPerfil } = useAuth();

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  useEffect(() => {
    async function buscarPerfil() {
      try {
        await carregarPerfil();
      } catch (erro) {
        setErro(
          erro instanceof Error
            ? erro.message
            : "Erro ao carregar perfil!"
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarPerfil();
  }, []);

  function iniciarEdicao() {
    if (!usuario) return;

    setNome(usuario.nome);
    setCpf(usuario.cpf);
    setTelefone(usuario.telefone);
    setSenha("");
    setConfirmarSenha("");
    setErro("");
    setMensagem("");
    setEditando(true);
  }

  function cancelarEdicao() {
    setEditando(false);
    setErro("");
    setMensagem("");
    setSenha("");
    setConfirmarSenha("");
  }

  async function salvarPerfil(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    setSalvando(true);
    setErro("");
    setMensagem("");

    try {
      const dadosAtualizados: {
        nome: string;
        cpf: string;
        telefone: string;
        senha?: string;
        confirmarSenha?: string;
      } = {
        nome,
        cpf,
        telefone
      };

      if (senha || confirmarSenha) {
        dadosAtualizados.senha = senha;
        dadosAtualizados.confirmarSenha = confirmarSenha;
      }

      const resultado = await atualizarPerfil(dadosAtualizados);

      setMensagem(resultado);
      setEditando(false);
      setSenha("");
      setConfirmarSenha("");
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : "Erro ao atualizar perfil!"
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="container py-5">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="container py-5">
        <h2>Meu Perfil</h2>
        <p className="text-danger">
          {erro || "Usuário não encontrado."}
        </p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Meu Perfil</h2>
      <p>Gerencie suas informações pessoais.</p>

      {mensagem && (
        <div className="alert alert-success">{mensagem}</div>
      )}

      {erro && (
        <div className="alert alert-danger">{erro}</div>
      )}

      <div className="card mt-4">
        <div className="card-body">
          {!editando ? (
            <>
              <p><strong>Nome:</strong> {usuario.nome}</p>
              <p><strong>E-mail:</strong> {usuario.email}</p>
              <p><strong>CPF:</strong> {usuario.cpf}</p>
              <p><strong>Telefone:</strong> {usuario.telefone}</p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={iniciarEdicao}
              >
                Editar perfil
              </button>
            </>
          ) : (
            <form onSubmit={salvarPerfil}>
              <div className="mb-3">
                <label htmlFor="perfil-nome" className="form-label">
                  Nome
                </label>
                <input
                  id="perfil-nome"
                  type="text"
                  className="form-control"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="perfil-email" className="form-label">
                  E-mail
                </label>
                <input
                  id="perfil-email"
                  type="email"
                  className="form-control"
                  value={usuario.email}
                  disabled
                />
                <small className="text-muted">
                  O e-mail não pode ser alterado.
                </small>
              </div>

              <div className="mb-3">
                <label htmlFor="perfil-cpf" className="form-label">
                  CPF
                </label>
                <input
                  id="perfil-cpf"
                  type="text"
                  className="form-control"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="perfil-telefone" className="form-label">
                  Telefone
                </label>
                <input
                  id="perfil-telefone"
                  type="tel"
                  className="form-control"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>

              <hr />

              <h5>Alterar senha (opcional)</h5>

              <div className="mb-3">
                <label htmlFor="perfil-senha" className="form-label">
                  Nova senha
                </label>
                <input
                  id="perfil-senha"
                  type="password"
                  className="form-control"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="perfil-confirmar" className="form-label">
                  Confirmar nova senha
                </label>
                <input
                  id="perfil-confirmar"
                  type="password"
                  className="form-control"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={salvando}
                >
                  {salvando ? "Salvando..." : "Salvar alterações"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelarEdicao}
                  disabled={salvando}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
