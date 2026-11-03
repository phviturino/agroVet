import { useState, type FormEvent } from "react";
import { api } from "../../../api/axios";

type Categoria = {
  nome: string;
  descricao: string;
};

export function CategoriaCreatePage() {
  const [form, setForm] = useState<Categoria>({
    nome: "",
    descricao: "",
  });
  const [loading, setLoading] = useState(false);

  async function onFormSubmit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    try {
      await api.post("/categorias", form);
      alert("Categoria cadastrada com sucesso!");
      setForm({
        nome: "",
        descricao: "",
      });
    } catch (error) {
      alert("Erro ao cadastrar categoria!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onFormSubmit} className="card p-4 shadow-sm border-0 my-4">
      <h2>Nova Categoria</h2>

      <div className="mb-3">
        <label className="form-label">Nome da Categoria</label>
        <input
          type="text"
          className="form-control"
          value={form.nome}
          onChange={(ev) => setForm({ ...form, nome: ev.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descrição</label>
        <textarea
          className="form-control"
          value={form.descricao}
          onChange={(ev) => setForm({ ...form, descricao: ev.target.value })}
        />
      </div>

      <button type="submit" className="btn btn-warning fw-bold" disabled={loading}>
        {loading ? "Salvando..." : "Salvar Categoria"}
      </button>
    </form>
  );
}