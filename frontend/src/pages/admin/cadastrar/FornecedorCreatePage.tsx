import { useState, type FormEvent } from "react";
import { api } from "../../../api/axios";

type Fornecedor = {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
};

export function FornecedorCreatePage() {
  const [form, setForm] = useState<Fornecedor>({
    nome: "",
    cnpj: "",
    telefone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  async function onFormSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/fornecedores", form);
      alert("Fornecedor cadastrado com sucesso!");
      setForm({
        nome: "",
        cnpj: "",
        telefone: "",
        email: "",
      });
    } catch (error) {
      alert("Erro ao cadastrar fornecedor!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onFormSubmit} className="card p-4 shadow-sm border-0 my-4">
      <h2>Novo Fornecedor</h2>

      <div className="mb-3">
        <label className="form-label">Razão Social / Nome</label>
        <input
          type="text"
          className="form-control"
          value={form.nome}
          onChange={(ev) => setForm({ ...form, nome: ev.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">CNPJ</label>
        <input
          type="text"
          className="form-control"
          value={form.cnpj}
          onChange={(ev) => setForm({ ...form, cnpj: ev.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Telefone</label>
        <input
          type="text"
          className="form-control"
          value={form.telefone}
          onChange={(ev) => setForm({ ...form, telefone: ev.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">E-mail</label>
        <input
          type="email"
          className="form-control"
          value={form.email}
          onChange={(ev) => setForm({ ...form, email: ev.target.value })}
        />
      </div>

      <button type="submit" className="btn btn-info text-white fw-bold" disabled={loading}>
        {loading ? "Salvando..." : "Salvar Fornecedor"}
      </button>
    </form>
  );
}