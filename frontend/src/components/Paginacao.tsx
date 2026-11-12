
type PaginacaoProps = {
  paginaAtual: number;
  totalPaginas: number;
  aoMudarPagina: (pagina: number) => void;
};

export default function Paginacao({
  paginaAtual,
  totalPaginas,
  aoMudarPagina
}: PaginacaoProps) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
      <button
        type="button"
        className="btn btn-outline-primary"
        disabled={paginaAtual <= 1}
        onClick={() => aoMudarPagina(paginaAtual - 1)}
      >
        Anterior
      </button>

      <span className="fw-semibold">
        Página {paginaAtual} de {totalPaginas}
      </span>

      <button
        type="button"
        className="btn btn-outline-primary"
        disabled={paginaAtual >= totalPaginas}
        onClick={() => aoMudarPagina(paginaAtual + 1)}
      >
        Próxima
      </button>
    </div>
  );
}
