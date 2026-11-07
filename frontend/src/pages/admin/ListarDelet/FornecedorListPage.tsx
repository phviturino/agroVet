import { useEffect, useState } from "react";
import { api } from "../../../api/axios";

type Fornecedor = {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
};

type Props = {
  onEdit?: (id: number) => void;
};

export function FornecedorListPage({ onEdit }: Props) {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarFornecedores() {
    setLoading(true);
    try {
      const response = await api.get("/fornecedores");
      setFornecedores(response.data);
    } catch (err) {
      alert("Erro ao carregar lista de fornecedores.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarFornecedores();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este fornecedor?")) return;

    try {
      await api.delete(`/fornecedores/${id}`);
      alert("Fornecedor excluído com sucesso!");
      carregarFornecedores();
    } catch (err) {
      alert("Erro ao excluir o fornecedor.");
    }
  }

  if (loading) return <p className="my-4 text-center">Carregando fornecedores...</p>;

  return (
    <div className="card p-4 shadow-sm border-0 my-4">
      <h2 className="mb-4">Gerenciar Fornecedores</h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Telefone</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.nome}</td>
                <td>{f.cnpj}</td>
                <td>{f.telefone}</td>
                <td className="text-end">
                  {onEdit && (
                    <button
                      className="btn btn-warning btn-sm me-2 fw-bold"
                      onClick={() => onEdit(f.id)}
                    >
                      Editar
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(f.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {fornecedores.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  Nenhum fornecedor cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}