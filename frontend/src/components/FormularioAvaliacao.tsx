import { useState } from "react";
import "./FormularioAvaliacao.css";

interface FormularioAvaliacaoProps {
  onEnviar: (nota: number, comentario: string) => Promise<boolean>;
  enviando: boolean;
}

export default function FormularioAvaliacao({
  onEnviar,
  enviando
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
    <div className="form-avaliacao">
      <span className="form-avaliacao-etiqueta">
        SUA OPINIÃO IMPORTA
      </span>

      <h3 className="form-avaliacao-titulo">
        Deixe sua avaliação
      </h3>

      <p className="form-avaliacao-descricao">
        Compartilhe sua experiência com este produto.
      </p>

      <div className="mb-4">
        <p className="form-avaliacao-label">Sua nota:</p>

        <div
          className="form-avaliacao-estrelas"
          role="group"
          aria-label="Selecione sua nota"
        >
          {[1, 2, 3, 4, 5].map((estrela) => (
            <button
              key={estrela}
              type="button"
              className={`form-avaliacao-estrela ${
                estrela <= notaSelecionada ? "selecionada" : ""
              }`}
              onClick={() => setNotaSelecionada(estrela)}
              aria-label={`Avaliar com ${estrela} estrelas`}
              aria-pressed={notaSelecionada === estrela}
              disabled={enviando}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <label
        htmlFor="comentario-avaliacao"
        className="form-avaliacao-label"
      >
        Seu comentário:
      </label>

      <textarea
        id="comentario-avaliacao"
        className="form-control form-avaliacao-textarea"
        rows={4}
        placeholder="Conte sua experiência com este produto..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        maxLength={500}
        disabled={enviando}
      />

      <div className="form-avaliacao-contador">
        {comentario.length}/500 caracteres
      </div>

      <button
        type="button"
        className="form-avaliacao-enviar"
        onClick={enviar}
        disabled={enviando}
      >
        {enviando ? "Enviando..." : "Enviar avaliação"}
        {!enviando && <span aria-hidden="true">→</span>}
      </button>
    </div>
  );
}
