import { useState, useEffect, type FormEvent } from "react";
import { api } from "../../../api/axios";

type Props = {
  categoriaId: number;
  onSuccess: () => void;
};

export function CategoriaEditPage({ categoriaId, onSuccess }: Props) {
  const [form, setForm] = useState({ nome: "", descricao: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get(`/categorias/${categoriaId}`);
        setForm({
          nome: res.data.nome || "",
          descricao: res.data.descricao || "",
        });
      } catch (err) {
        alert("Erro ao carregar dados da categoria.");
      }
    }
    carregar();
  }, [categoriaId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/categorias/${categoriaId}`, form);
      alert("Categoria atualizada com sucesso!");
      onSuccess();
    } catch (err: any) {
      console.error("Erro ao atualizar categoria:", err.response?.data || err.message);
      alert("Erro ao salvar as alterações da categoria.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0 my-4">
      <h2>Editar Categoria #{categoriaId}</h2>

      <div className="mb-3">
        <label className="form-label">Nome da Categoria</label>
        <input
          type="text"
          className="form-control"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descrição</label>
        <textarea
          className="form-control"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />
      </div>

      <button type="submit" className="btn btn-warning fw-bold" disabled={loading}>
        {loading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </form>
  );
}