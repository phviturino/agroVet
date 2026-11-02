import { useEffect, useState } from "react";
import { api } from "../../../api/axios";

type Categoria = {
  id: number;
  nome: string;
  descricao: string;
};

type Props = {
  onEdit?: (id: number) => void;
};

export function CategoriaListPage({ onEdit }: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarCategorias() {
    setLoading(true);
    try {
      const response = await api.get("/categorias");
      setCategorias(response.data);
    } catch (err) {
      alert("Erro ao carregar lista de categorias.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      await api.delete(`/categorias/${id}`);
      alert("Categoria excluída com sucesso!");
      carregarCategorias();
    } catch (err) {
      alert("Erro ao excluir a categoria.");
    }
  }

  if (loading) return <p className="my-4 text-center">Carregando categorias...</p>;

  return (
    <div className="card p-4 shadow-sm border-0 my-4">
      <h2 className="mb-4">Gerenciar Categorias</h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.descricao || "-"}</td>
                <td className="text-end">
                  {onEdit && (
                    <button
                      className="btn btn-warning btn-sm me-2 fw-bold"
                      onClick={() => onEdit(c.id)}
                    >
                      Editar
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(c.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {categorias.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  Nenhuma categoria cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}