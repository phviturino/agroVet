import React, { useEffect, useState } from 'react';

interface Produto {
  id: number;
  nome: string;
  preço: number;
  imagem: string;
  descricao?: string;
  categoria?: string;
}

export default function DetalheProduto() {
  // Pega o ID diretamente da URL (ex: /produtos/135 -> pega 135)
  const path = window.location.pathname;
  const id = path.split('/').filter(Boolean).pop();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setErro('ID de produto inválido.');
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:3001/api/produtos/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Produto não encontrado');
        }
        return res.json();
      })
      .then((data: Produto) => {
        setProduto(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErro('Não foi possível carregar as informações deste produto.');
        setLoading(false);
      });
  }, [id]);

  const getWhatsAppLink = (nomeProduto: string) => {
    const mensagem = encodeURIComponent(`Olá! Gostaria de mais informações sobre o produto: ${nomeProduto}`);
    return `https://api.whatsapp.com/send?phone=5544998514080&text=${mensagem}`;
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Carregando produto...</span>
        </div>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-warning py-4 shadow-sm" role="alert">
          <h4 className="fw-bold">Atenção</h4>
          <p className="mb-0">{erro || 'Produto não encontrado.'}</p>
        </div>
        <a href="/produtos" className="btn btn-outline-dark fw-bold mt-3">
          ← Voltar para o Catálogo
        </a>
      </div>
    );
  }

  return (
    <main className="container my-5">
      <a href="/produtos" className="btn btn-outline-secondary btn-sm mb-4 fw-bold">
        ← Voltar aos produtos
      </a>

      <div className="card border-0 shadow bg-dark text-white p-4">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-5 text-center bg-white p-4 rounded">
            <img
              src={`/img/${produto.imagem}`}
              alt={produto.nome}
              className="img-fluid object-fit-contain"
              style={{ maxHeight: '350px' }}
            />
          </div>

          <div className="col-12 col-md-7 d-flex flex-column">
            {produto.categoria && (
              <span className="badge bg-success mb-2 align-self-start fs-6">
                {produto.categoria}
              </span>
            )}
            <h2 className="fw-bold mb-3">{produto.nome}</h2>

            <p className="text-secondary fs-6 mb-4">
              {produto.descricao || 'Produto de alta qualidade disponível para pronta entrega nas nossas lojas.'}
            </p>

            <div className="mt-auto">
              <h3 className="text-warning fw-bold mb-3">
                R${' '}
                {Number(produto.preço).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>

              <a
                href={getWhatsAppLink(produto.nome)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success btn-lg w-100 fw-bold py-3 text-uppercase shadow"
              >
                <i className="bi bi-whatsapp me-2"></i> Peça via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}