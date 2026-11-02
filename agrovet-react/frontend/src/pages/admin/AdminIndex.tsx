import { useState } from 'react';
import { ProdutoCreatePage } from "./cadastrar/ProdutoCreatePage";
import { CategoriaCreatePage } from "./cadastrar/CategoriaCreatePage";
import { FornecedorCreatePage } from "./cadastrar/FornecedorCreatePage";

import { ProdutoListPage } from "./ListarDelet/ProdutoListPage";
import { CategoriaListPage } from "./ListarDelet/CategoriaListPage";
import { FornecedorListPage } from "./ListarDelet/FornecedorListPage";

import { ProdutoEditPage } from "./editar/ProdutoEditPage";
import { CategoriaEditPage } from "./editar/CategoriaEditPage";
import { FornecedorEditPage } from "./editar/FornecedorEditPage";

export default function AdminIndex() {
  const [opcao, setOpcao] = useState<string>('menu');
  const [editId, setEditId] = useState<number | null>(null);

  const handleEdit = (tela: string, id: number) => {
    setEditId(id);
    setOpcao(tela);
  };

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-dark m-0">Painel Administrativo</h2>
        {opcao !== 'menu' && (
          <button className="btn btn-outline-secondary" onClick={() => setOpcao('menu')}>
            ← Voltar ao Menu Admin
          </button>
        )}
      </div>

      {opcao === 'menu' && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 bg-dark text-white p-4">
              <h3 className="text-success mb-3">📦 Produtos</h3>
              <div className="d-grid gap-2 mt-auto">
                <button className="btn btn-success fw-bold" onClick={() => setOpcao('cadastrar-produto')}>+ Novo Produto</button>
                <button className="btn btn-outline-light" onClick={() => setOpcao('listar-produto')}>📋 Gerenciar / Excluir</button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 bg-dark text-white p-4">
              <h3 className="text-warning mb-3">🏷️ Categorias</h3>
              <div className="d-grid gap-2 mt-auto">
                <button className="btn btn-warning fw-bold" onClick={() => setOpcao('cadastrar-categoria')}>+ Nova Categoria</button>
                <button className="btn btn-outline-light" onClick={() => setOpcao('listar-categoria')}>📋 Gerenciar / Excluir</button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 bg-dark text-white p-4">
              <h3 className="text-info mb-3">🚚 Fornecedores</h3>
              <div className="d-grid gap-2 mt-auto">
                <button className="btn btn-info text-white fw-bold" onClick={() => setOpcao('cadastrar-fornecedor')}>+ Novo Fornecedor</button>
                <button className="btn btn-outline-light" onClick={() => setOpcao('listar-fornecedor')}>📋 Gerenciar / Excluir</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDERIZAÇÃO DAS PÁGINAS */}
      {opcao === 'cadastrar-produto' && <ProdutoCreatePage />}
      {opcao === 'cadastrar-categoria' && <CategoriaCreatePage />}
      {opcao === 'cadastrar-fornecedor' && <FornecedorCreatePage />}

      {opcao === 'listar-produto' && <ProdutoListPage onEdit={(id) => handleEdit('editar-produto', id)} />}
      {opcao === 'listar-categoria' && <CategoriaListPage onEdit={(id) => handleEdit('editar-categoria', id)} />}
      {opcao === 'listar-fornecedor' && <FornecedorListPage onEdit={(id) => handleEdit('editar-fornecedor', id)} />}

      {opcao === 'editar-produto' && editId && <ProdutoEditPage produtoId={editId} onSuccess={() => setOpcao('listar-produto')} />}
      {opcao === 'editar-categoria' && editId && <CategoriaEditPage categoriaId={editId} onSuccess={() => setOpcao('listar-categoria')} />}
      {opcao === 'editar-fornecedor' && editId && <FornecedorEditPage fornecedorId={editId} onSuccess={() => setOpcao('listar-fornecedor')} />}
    </main>
  );
}