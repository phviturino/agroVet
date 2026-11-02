import { useEffect, useState } from 'react';
import { api } from '../../api/axios';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { ProdutoCreatePage } from "./cadastrar/ProdutoCreatePage";
import { CategoriaCreatePage } from "./cadastrar/CategoriaCreatePage";
import { FornecedorCreatePage } from "./cadastrar/FornecedorCreatePage";

import { ProdutoListPage } from "./ListarDelet/ProdutoListPage";
import { CategoriaListPage } from "./ListarDelet/CategoriaListPage";
import { FornecedorListPage } from "./ListarDelet/FornecedorListPage";

import { ProdutoEditPage } from "./editar/ProdutoEditPage";
import { CategoriaEditPage } from "./editar/CategoriaEditPage";
import { FornecedorEditPage } from "./editar/FornecedorEditPage";

type Produto = {
  id: number;
  nome: string;
  categoria: string | null;
};

type Categoria = {
  id: number;
  nome: string;
};

type Fornecedor = {
  id: number;
  nome: string;
};

type DadoGrafico = {
  nome: string;
  quantidade: number;
};

export default function AdminIndex() {
  const [opcao, setOpcao] = useState<string>('menu');
  const [editId, setEditId] = useState<number | null>(null);

  const [dadosCategorias, setDadosCategorias] = useState<DadoGrafico[]>([]);
  const [dadosResumo, setDadosResumo] = useState<DadoGrafico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGraficos, setErroGraficos] = useState(false);

  const handleEdit = (tela: string, id: number) => {
    setEditId(id);
    setOpcao(tela);
  };

  // BUSCA DOS DADOS DA API
  useEffect(() => {
    if (opcao !== 'menu') return;

    let ativo = true;

    async function carregarGraficos() {
      setCarregando(true);
      setErroGraficos(false);

      try {
        const [resProdutos, resCategorias, resFornecedores] =
          await Promise.all([
            api.get<Produto[]>('/produtos'),
            api.get<Categoria[]>('/categorias'),
            api.get<Fornecedor[]>('/fornecedores')
          ]);

        if (!ativo) return;

        const produtos = resProdutos.data;
        const categorias = resCategorias.data;
        const fornecedores = resFornecedores.data;

        // GRÁFICO DE BARRAS: PRODUTOS POR CATEGORIA
        const categoriasGrafico = categorias.map((categoria) => ({
          nome: categoria.nome,
          quantidade: produtos.filter(
            (produto) => produto.categoria === categoria.nome
          ).length
        }));

        const semCategoria = produtos.filter(
          (produto) => !produto.categoria
        ).length;

        if (semCategoria > 0) {
          categoriasGrafico.push({
            nome: 'Sem categoria',
            quantidade: semCategoria
          });
        }

        setDadosCategorias(categoriasGrafico);

        // GRÁFICO DE COLUNAS: RESUMO DOS CADASTROS
        setDadosResumo([
          { nome: 'Produtos', quantidade: produtos.length },
          { nome: 'Categorias', quantidade: categorias.length },
          { nome: 'Fornecedores', quantidade: fornecedores.length }
        ]);

      } catch (erro) {
        console.error('Erro ao carregar gráficos:', erro);

        if (ativo) {
          setErroGraficos(true);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarGraficos();

    return () => {
      ativo = false;
    };
  }, [opcao]);

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-dark m-0">
          Painel Administrativo
        </h2>

        {opcao !== 'menu' && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => setOpcao('menu')}
          >
            ← Voltar ao Menu Admin
          </button>
        )}
      </div>

      {opcao === 'menu' && (
        <>
          {/* MENU ADMINISTRATIVO */}
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 bg-dark text-white p-4">
                <h3 className="text-success mb-3">📦 Produtos</h3>
                <div className="d-grid gap-2 mt-auto">
                  <button
                    className="btn btn-success fw-bold"
                    onClick={() => setOpcao('cadastrar-produto')}
                  >
                    + Novo Produto
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setOpcao('listar-produto')}
                  >
                    📋 Gerenciar / Excluir
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 bg-dark text-white p-4">
                <h3 className="text-warning mb-3">🏷️ Categorias</h3>
                <div className="d-grid gap-2 mt-auto">
                  <button
                    className="btn btn-warning fw-bold"
                    onClick={() => setOpcao('cadastrar-categoria')}
                  >
                    + Nova Categoria
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setOpcao('listar-categoria')}
                  >
                    📋 Gerenciar / Excluir
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 bg-dark text-white p-4">
                <h3 className="text-info mb-3">🚚 Fornecedores</h3>
                <div className="d-grid gap-2 mt-auto">
                  <button
                    className="btn btn-info text-white fw-bold"
                    onClick={() => setOpcao('cadastrar-fornecedor')}
                  >
                    + Novo Fornecedor
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => setOpcao('listar-fornecedor')}
                  >
                    📋 Gerenciar / Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* INDICADORES */}
          <section className="mt-5">
            <h3 className="fw-bold mb-2">
              📊 Indicadores do AgroVet
            </h3>

            <p className="text-muted mb-4">
              Visualização dos dados cadastrados no sistema.
            </p>

            {carregando ? (
              <p>Carregando gráficos...</p>
            ) : erroGraficos ? (
              <div className="alert alert-danger">
                Não foi possível carregar os gráficos.
                Verifique se a API está funcionando.
              </div>
            ) : (
              <div className="row g-4">

                {/* GRÁFICO DE BARRAS HORIZONTAIS */}
                <div className="col-lg-6">
                  <div className="card shadow-sm border-0 p-4 h-100">
                    <h5 className="fw-bold mb-2">
                      Produtos por Categoria
                    </h5>

                    <p className="text-muted small">
                      Distribuição dos produtos entre as categorias.
                    </p>

                    {dadosCategorias.length === 0 ? (
                      <p className="text-muted">
                        Nenhuma categoria cadastrada.
                      </p>
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: Math.max(300, dadosCategorias.length * 48)
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={dadosCategorias}
                            layout="vertical"
                            margin={{
                              top: 10,
                              right: 20,
                              left: 10,
                              bottom: 10
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                              type="number"
                              allowDecimals={false}
                            />

                            <YAxis
                              type="category"
                              dataKey="nome"
                              width={110}
                              tick={{ fontSize: 11 }}
                            />

                            <Tooltip />

                            <Bar
                              dataKey="quantidade"
                              name="Produtos"
                              fill="#198754"
                              radius={[0, 5, 5, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>

                {/* GRÁFICO DE COLUNAS VERTICAIS */}
                <div className="col-lg-6">
                  <div className="card shadow-sm border-0 p-4 h-100">
                    <h5 className="fw-bold mb-2">
                      Resumo dos Cadastros
                    </h5>

                    <p className="text-muted small">
                      Quantidade de registros por tipo.
                    </p>

                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={dadosResumo}
                          margin={{
                            top: 10,
                            right: 20,
                            left: 0,
                            bottom: 10
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />

                          <XAxis
                            dataKey="nome"
                            tick={{ fontSize: 12 }}
                          />

                          <YAxis allowDecimals={false} />

                          <Tooltip />

                          <Bar
                            dataKey="quantidade"
                            name="Registros"
                            fill="#0d6efd"
                            radius={[5, 5, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </section>
        </>
      )}

      {/* CADASTROS */}
      {opcao === 'cadastrar-produto' && <ProdutoCreatePage />}
      {opcao === 'cadastrar-categoria' && <CategoriaCreatePage />}
      {opcao === 'cadastrar-fornecedor' && <FornecedorCreatePage />}

      {/* LISTAGENS */}
      {opcao === 'listar-produto' && (
        <ProdutoListPage
          onEdit={(id) => handleEdit('editar-produto', id)}
        />
      )}

      {opcao === 'listar-categoria' && (
        <CategoriaListPage
          onEdit={(id) => handleEdit('editar-categoria', id)}
        />
      )}

      {opcao === 'listar-fornecedor' && (
        <FornecedorListPage
          onEdit={(id) => handleEdit('editar-fornecedor', id)}
        />
      )}

      {/* EDIÇÕES */}
      {opcao === 'editar-produto' && editId !== null && (
        <ProdutoEditPage
          produtoId={editId}
          onSuccess={() => setOpcao('listar-produto')}
        />
      )}

      {opcao === 'editar-categoria' && editId !== null && (
        <CategoriaEditPage
          categoriaId={editId}
          onSuccess={() => setOpcao('listar-categoria')}
        />
      )}

      {opcao === 'editar-fornecedor' && editId !== null && (
        <FornecedorEditPage
          fornecedorId={editId}
          onSuccess={() => setOpcao('listar-fornecedor')}
        />
      )}
    </main>
  );
}