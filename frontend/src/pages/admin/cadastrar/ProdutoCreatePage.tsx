
import { toast } from "react-toastify";
import { useEffect, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { api } from "../../../api/axios.ts";

type Produto = {
  nome: string;
  preco: string;
  estoque: string;
  id_categoria: string;
  imagem: string;
  descricao: string;
};

type Categoria = {
  id: number;
  nome: string;
};

const formularioInicial: Produto = {
  nome: "",
  preco: "",
  estoque: "",
  id_categoria: "",
  imagem: "",
  descricao: "",
};

export function ProdutoCreatePage() {
  const [form, setForm] = useState<Produto>(formularioInicial);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const resposta = await api.get<Categoria[]>("/categorias");
        setCategorias(resposta.data);
      } catch {
        toast.error("Não foi possível carregar as categorias.");
      }
    }

    carregarCategorias();
  }, []);

  async function onFormSubmit(event: FormEvent) {
    event.preventDefault();

    if (loading) return;

    if (!form.nome.trim()) {
      toast.warning("Informe o nome do produto.");
      return;
    }

    if (
      !form.preco.trim() ||
      !Number.isFinite(Number(form.preco)) ||
      Number(form.preco) < 0
    ) {
      toast.warning("Informe um preço válido.");
      return;
    }

    if (
      !form.estoque.trim() ||
      !Number.isInteger(Number(form.estoque)) ||
      Number(form.estoque) < 0
    ) {
      toast.warning("Informe um estoque válido.");
      return;
    }

    if (!form.id_categoria) {
      toast.warning("Selecione uma categoria.");
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/produtos",
        {
          nome: form.nome.trim(),
          preco: Number(form.preco),
          estoque: Number(form.estoque),
          id_categoria: Number(form.id_categoria),
          imagem: form.imagem,
          descricao: form.descricao,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setForm(formularioInicial);
      toast.success("Produto cadastrado com sucesso!");
    } catch (erro) {
      console.error("Erro ao cadastrar produto:", erro);

      toast.error(
        isAxiosError(erro)
          ? erro.response?.data?.mensagem ||
            "Não foi possível cadastrar o produto."
          : "Não foi possível cadastrar o produto."
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
      <h2>Novo Produto</h2>

      <div className="mb-3">
        <label className="form-label">Nome do Produto</label>
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
        <label className="form-label">Preço (R$)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="form-control"
          value={form.preco}
          onChange={(ev) =>
            setForm({ ...form, preco: ev.target.value })
          }
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Estoque</label>
        <input
          type="number"
          min="0"
          step="1"
          className="form-control"
          value={form.estoque}
          onChange={(ev) =>
            setForm({ ...form, estoque: ev.target.value })
          }
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Categoria</label>
        <select
          className="form-select"
          value={form.id_categoria}
          onChange={(ev) =>
            setForm({ ...form, id_categoria: ev.target.value })
          }
          required
        >
          <option value="">Selecione uma categoria</option>

          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Nome do Ficheiro da Imagem</label>
        <input
          type="text"
          className="form-control"
          value={form.imagem}
          onChange={(ev) =>
            setForm({ ...form, imagem: ev.target.value })
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descrição</label>
        <textarea
          className="form-control"
          value={form.descricao}
          onChange={(ev) =>
            setForm({ ...form, descricao: ev.target.value })
          }
        />
      </div>

      <button
        type="submit"
        className="btn btn-success"
        disabled={loading}
      >
        {loading ? "Salvando..." : "Salvar Produto"}
      </button>
    </form>
  );
}
