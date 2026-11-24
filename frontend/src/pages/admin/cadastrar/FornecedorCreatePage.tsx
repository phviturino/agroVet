
import { toast } from "react-toastify";
import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { api } from "../../../api/axios";

type Fornecedor = {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
};

const formularioInicial: Fornecedor = {
  nome: "",
  cnpj: "",
  telefone: "",
  email: "",
};

export function FornecedorCreatePage() {
  const [form, setForm] = useState<Fornecedor>(formularioInicial);
  const [loading, setLoading] = useState(false);

  async function onFormSubmit(event: FormEvent) {
    event.preventDefault();

    if (loading) return;

    if (!form.nome.trim()) {
      toast.warning("Informe o nome do fornecedor.");
      return;
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(form.email.trim())
    ) {
      toast.warning("Informe um e-mail válido.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/fornecedores", {
        nome: form.nome.trim(),
        cnpj: form.cnpj.trim() || null,
        telefone: form.telefone.trim() || null,
        email: form.email.trim() || null,
      });

      toast.success("Fornecedor cadastrado com sucesso!");
      setForm(formularioInicial);
    } catch (erro) {
      console.error("Erro ao cadastrar fornecedor:", erro);

      toast.error(
        isAxiosError(erro)
          ? erro.response?.data?.mensagem ||
            "Não foi possível cadastrar o fornecedor."
          : "Não foi possível cadastrar o fornecedor."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onFormSubmit}
      className="card p-4 shadow-sm border-0 my-4"
    >
      <h2>Novo Fornecedor</h2>

      <div className="mb-3">
        <label className="form-label">Razão Social / Nome</label>
        <input
          type="text"
          className="form-control"
          value={form.nome}
          onChange={(ev) =>
            setForm({ ...form, nome: ev.target.value })
          }
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">CNPJ</label>
        <input
          type="text"
          className="form-control"
          value={form.cnpj}
          onChange={(ev) =>
            setForm({ ...form, cnpj: ev.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Telefone</label>
        <input
          type="tel"
          className="form-control"
          value={form.telefone}
          onChange={(ev) =>
            setForm({ ...form, telefone: ev.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label">E-mail</label>
        <input
          type="email"
          className="form-control"
          value={form.email}
          onChange={(ev) =>
            setForm({ ...form, email: ev.target.value })
          }
        />
      </div>

      <button
        type="submit"
        className="btn btn-info text-white fw-bold"
        disabled={loading}
      >
        {loading ? "Salvando..." : "Salvar Fornecedor"}
      </button>
    </form>
  );
}
