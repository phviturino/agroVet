import { useState, useEffect, type FormEvent } from "react";
import { api } from "../../../api/axios";
import axios from "axios";

type Props = {
  fornecedorId: number;
  onSuccess: () => void;
};

export function FornecedorEditPage({ fornecedorId, onSuccess }: Props) {
  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    telefone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get(`/fornecedores/${fornecedorId}`);
        setForm({
          nome: res.data.nome || "",
          cnpj: res.data.cnpj || "",
          telefone: res.data.telefone || "",
          email: res.data.email || "",
        });
      } catch (err) {
        alert("Erro ao carregar dados do fornecedor.");
      }
    }
    carregar();
  }, [fornecedorId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/fornecedores/${fornecedorId}`, form);
      alert("Fornecedor atualizado com sucesso!");
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Erro ao atualizar fornecedor:",
          err.response?.data || err.message
        );
      } else {
        console.error("Erro desconhecido:", err);
      }

      alert("Erro ao salvar as alterações do fornecedor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0 my-4">
      <h2>Editar Fornecedor #{fornecedorId}</h2>

      <div className="mb-3">
        <label className="form-label">Razão Social / Nome</label>
        <input
          type="text"
          className="form-control"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">CNPJ</label>
        <input
          type="text"
          className="form-control"
          value={form.cnpj}
          onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Telefone</label>
        <input
          type="text"
          className="form-control"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">E-mail</label>
        <input
          type="email"
          className="form-control"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <button type="submit" className="btn btn-info text-white fw-bold" disabled={loading}>
        {loading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </form>
  );
}