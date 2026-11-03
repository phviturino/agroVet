import { useState, useEffect, type FormEvent } from "react";
import { api } from "../../../api/axios";

type Props = {
  produtoId: number;
  onSuccess: () => void;
};

export function ProdutoEditPage({ produtoId, onSuccess }: Props) {
  const [form, setForm] = useState({
    nome: "",
    preço: "",
    imagem: "",
    descricao: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregarProduto() {
      try {
        const response = await api.get(`/produtos/${produtoId}`);
        setForm({
          nome: response.data.nome || "",
          preço: response.data.preço || "",
          imagem: response.data.imagem || "",
          descricao: response.data.descricao || "",
        });
      } catch (err) {
        alert("Erro ao carregar os dados do produto.");
      }
    }
    carregarProduto();
  }, [produtoId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const dadosParaEnviar = {
        ...form,
        preço: Number(String(form.preço).replace(',', '.')),
      };

      await api.put(`/produtos/${produtoId}`, dadosParaEnviar);
      alert("Produto atualizado com sucesso!");
      onSuccess();
    } catch (err: any) {
      alert("Erro ao salvar as alterações do produto. Verifique se a rota PUT existe no backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0 my-4">
      <h2>Editar Produto #{produtoId}</h2>
      <div className="mb-3">
        <label className="form-label">Nome</label>
        <input
          type="text"
          className="form-control"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Preço</label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={form.preço}
          onChange={(e) => setForm({ ...form, preço: e.target.value })}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">URL da Imagem</label>
        <input
          type="text"
          className="form-control"
          value={form.imagem}
          onChange={(e) => setForm({ ...form, imagem: e.target.value })}
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
      <button type="submit" className="btn btn-primary fw-bold" disabled={loading}>
        {loading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </form>
  );
}