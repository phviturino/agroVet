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
            <div className="card h-100 border-0 shadow bg-dark text-white position-relative">
                <div className="p-3 bg-white d-flex align-items-center justify-content-center container-foto-produto">
                    {quantidadeAvaliacoes > 0 && (
                        <span
                            className="position-absolute top-0 start-0 m-3 badge rounded-pill bg-white shadow-sm"
                            style={{ color: "#5423A6", zIndex: 2 }}
                        >
                            <span style={{ color: "#FF9B36" }}>★</span>{" "}
                            {mediaAvaliacoes.toFixed(1).replace(".", ",")}
                        </span>
                    )}
                    <img
                        src={`/img/${produto.imagem}`}
                        className="img-fluid foto-produto"
                        alt={produto.nome}
                    />
                </div>

                <div className="card-body d-flex flex-column text-center">
                    <h5 className="card-title fs-6 text-uppercase mb-2 nome-produto">
                        {produto.nome}
                    </h5>

                    <p className="card-text fw-bold fs-5 mt-auto mb-2 preço-produto text-warning">
                        R${' '}
                        {Number(produto.preco).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>

                    <a
                        href={`/produtos/${produto.id}`}
                        className="btn btn-success btn-sm w-100 fw-bold py-2 text-uppercase mt-auto stretched-link"
                    >
                        Ver Produto
                    </a>
                </div>
            </div>
        </div>
    );
}