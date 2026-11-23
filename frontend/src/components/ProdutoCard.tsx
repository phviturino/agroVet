import "./ProdutoCard.css";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  categoria?: string;
}

interface Avaliacao {
  id_produto: number;
  nota: number;
}

interface ProdutoCardProps {
  produto: Produto;
  avaliacoes: Avaliacao[];
}

export default function ProdutoCard({
  produto,
  avaliacoes
}: ProdutoCardProps) {

  const quantidadeAvaliacoes = avaliacoes.length;

  const mediaAvaliacoes =
    quantidadeAvaliacoes > 0
      ? avaliacoes.reduce(
          (soma, avaliacao) => soma + Number(avaliacao.nota),
          0
        ) / quantidadeAvaliacoes
      : 0;

  return (
    <div className="col">
      <article className="produto-card">
        <a
          href={`/produtos/${produto.id}`}
          className="produto-card-link"
          aria-label={`Ver produto ${produto.nome}`}
        >
          {/* IMAGEM E AVALIAÇÃO */}
          <div className="produto-card-imagem">
            {quantidadeAvaliacoes > 0 && (
              <span className="produto-card-avaliacao">
                <span className="produto-card-avaliacao-estrela">
                  ★
                </span>{" "}
                {mediaAvaliacoes.toFixed(1).replace(".", ",")}
              </span>
            )}

            <img
              src={
                produto.imagem
                  ? `/img/${produto.imagem}`
                  : "/img/sem-imagem.png"
              }
              alt={produto.nome}
              loading="lazy"
            />
          </div>

          <div className="produto-card-conteudo">
            <h3 className="produto-card-nome">
              {produto.nome}
            </h3>

            <p className="produto-card-preco">
              {Number(produto.preco).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              })}
            </p>

            <span className="produto-card-botao">
              Ver produto
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </a>
      </article>
    </div>
  );
}
