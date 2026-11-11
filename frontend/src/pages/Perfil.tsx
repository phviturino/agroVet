
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { validarCPF } from "../utils/validarCPF";

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

  const senhaForte =
    senha.length >= 8 &&
    /[A-Z]/.test(senha) &&
    /[a-z]/.test(senha) &&
    /[0-9]/.test(senha) &&
    /[^A-Za-z0-9]/.test(senha);

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
  }, [carregarPerfil]);

  function iniciarEdicao() {
    if (!usuario) return;

    setNome(usuario.nome);
    setCpf(usuario.cpf);
    setTelefone(usuario.telefone ?? "");
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

    if (salvando) return;

    setErro("");
    setMensagem("");

    if (!nome.trim()) {
      setErro("Informe seu nome.");
      return;
    }

    const cpfLimpo = cpf.replace(/\D/g, "");

    if (!validarCPF(cpfLimpo)) {
      setErro("CPF inválido. Verifique os números informados.");
      return;
    }

    if (!telefone.trim()) {
      setErro("Informe seu telefone.");
      return;
    }

    if (senha || confirmarSenha) {
      if (!senhaForte) {
        setErro(
          "A senha deve ter pelo menos 8 caracteres, letra maiúscula, minúscula, número e caractere especial."
        );
        return;
      }

      if (senha !== confirmarSenha) {
        setErro("As senhas não coincidem.");
        return;
      }
    }

    setSalvando(true);

    try {
      const dadosAtualizados: {
        nome: string;
        cpf: string;
        telefone: string;
        senha?: string;
        confirmarSenha?: string;
      } = {
        nome: nome.trim(),
        cpf: cpfLimpo,
        telefone: telefone.trim()
      };

      if (senha) {
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
        <a href="/login" className="btn btn-primary">
          Fazer login
        </a>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Meu Perfil</h2>
      <p>Gerencie suas informações pessoais.</p>

      {mensagem && (
        <div className="alert alert-success" role="status">
          {mensagem}
        </div>
      )}

      {erro && (
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      )}

      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          {!editando ? (
            <>
              <p>
                <strong>Nome:</strong> {usuario.nome}
              </p>
              <p>
                <strong>E-mail:</strong> {usuario.email}
              </p>
              <p>
                <strong>CPF:</strong> {usuario.cpf}
              </p>
              <p>
                <strong>Telefone:</strong> {usuario.telefone}
              </p>

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
                  maxLength={14}
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

                {senha && (
                  <div className="mt-2">
                    <small
                      className={
                        senhaForte
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                    >
                      {senhaForte ? "Senha forte" : "Senha fraca"}
                    </small>

                    {!senhaForte && (
                      <div className="text-muted small">
                        Mínimo de 8 caracteres, incluindo letra
                        maiúscula, minúscula, número e símbolo.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label
                  htmlFor="perfil-confirmar"
                  className="form-label"
                >
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

                {confirmarSenha && (
                  <small
                    className={
                      senha === confirmarSenha
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {senha === confirmarSenha
                      ? "As senhas coincidem."
                      : "As senhas não coincidem."}
                  </small>
                )}
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={salvando}
                >
                  {salvando
                    ? "Salvando..."
                    : "Salvar alterações"}
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
