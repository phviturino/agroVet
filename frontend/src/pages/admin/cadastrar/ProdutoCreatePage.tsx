import { useState, type FormEvent } from "react";
import { api } from "../../../api/axios.ts";

type Produto = {
  nome: string;
  preço: string;
  imagem: string;
  descricao: string;
};

export function ProdutoCreatePage() {
  const [form, setForm] = useState<Produto>({
    nome: "",
    preço: "",
    imagem: "",
    descricao: "",
  });
  const [loading, setLoading] = useState(false);

  async function onFormSubmit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    await api.post("/produtos", form);
    setLoading(false);

    setForm({
      nome: "",
      preço: "",
      imagem: "",
      descricao: "",
    });

    alert("Produto cadastrado com sucesso!");
  }

  return (
    <form onSubmit={onFormSubmit} className="card p-4 shadow-sm border-0 my-4">
      <h2>Novo Produto</h2>

      <div className="mb-3">
        <label className="form-label">Nome do Produto</label>
        <input
          type="text"
          className="form-control"
          value={form.nome}
          onChange={(ev) => setForm({ ...form, nome: ev.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Preço (R$)</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={form.preço}
          onChange={(ev) => setForm({ ...form, preço: ev.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Nome do Ficheiro da Imagem</label>
        <input
          type="text"
          className="form-control"
          value={form.imagem}
          onChange={(ev) => setForm({ ...form, imagem: ev.target.value })}
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

      <button type="submit" className="btn btn-success" disabled={loading}>
        {loading ? "Salvando..." : "Salvar Produto"}
      </button>
    </form>
  );
}