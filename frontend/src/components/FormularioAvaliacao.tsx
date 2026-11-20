
import { useState } from "react";

interface FormularioAvaliacaoProps {
  onEnviar: (nota: number, comentario: string) => Promise<boolean>;
  enviando: boolean;
  mensagem: string;
}

export default function FormularioAvaliacao({
  onEnviar,
  enviando,
  mensagem
}: FormularioAvaliacaoProps) {
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [comentario, setComentario] = useState("");

  const enviar = async () => {
    const sucesso = await onEnviar(notaSelecionada, comentario);

    if (sucesso) {
      setNotaSelecionada(0);
      setComentario("");
    }
  };

  return (
    <div className="mt-3">
      <h4 className="fw-bold mb-3">Deixe sua avaliação</h4>

      <p className="mb-2">Sua nota:</p>

      <div className="d-flex gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((estrela) => (
          <button
            key={estrela}
            type="button"
            className="btn border-0 p-0"
            onClick={() => setNotaSelecionada(estrela)}
            aria-label={`Avaliar com ${estrela} estrelas`}
            aria-pressed={notaSelecionada === estrela}
            style={{
              color:
                estrela <= notaSelecionada
                  ? "#FF9B36"
                  : "#6c757d",
              fontSize: "30px",
              lineHeight: 1
            }}
          >
            ★
          </button>
        ))}
      </div>

      <label
        htmlFor="comentario-avaliacao"
        className="form-label fw-bold"
      >
        Seu comentário:
      </label>

      <textarea
        id="comentario-avaliacao"
        className="form-control bg-dark text-white"
        rows={3}
        placeholder="Conte sua experiência com este produto..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        maxLength={500}
      />

      <small className="text-white-50">
        {comentario.length}/500 caracteres
      </small>

      <div className="mt-3">
        <button
          type="button"
          className="btn btn-success fw-bold"
          onClick={enviar}
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Enviar avaliação"}
        </button>
      </div>

      {mensagem && (
        <p className="mt-3 mb-0" role="status">
          {mensagem}
        </p>
      )}
    </div>
  );
}
