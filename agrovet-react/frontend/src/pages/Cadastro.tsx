import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./Cadastro.css";

function Cadastro() {
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");

    const navigate = useNavigate();

    function formatarCPF(valor: string) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);

        return numeros
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    function formatarTelefone(valor: string) {
        const numeros = valor.replace(/\D/g, "").slice(0, 11);

        if (numeros.length <= 10) {
            return numeros
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{4})(\d)/, "$1-$2");
        }

        return numeros
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
    }

    
async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (senha !== confirmarSenha) {
        setMensagem("As senhas não são iguais. Verifique e tente novamente.");
        return;
    }

    setMensagem("Cadastrando...");

    const formulario = new FormData(event.currentTarget);

    const dados = {
        nome: String(formulario.get("nome") ?? "").trim(),
        email: String(formulario.get("email") ?? "").trim(),
        cpf: cpf.replace(/\D/g, ""),
        telefone: telefone.replace(/\D/g, ""),
        senha,
    };

    try {
        const resposta = await fetch("http://localhost:3001/api/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.mensagem || "Não foi possível realizar o cadastro."
            );
        }

        setMensagem("Cadastro realizado com sucesso!");

        // Aguarda um instante para exibir a mensagem
        setTimeout(() => {
            navigate("/login");
        }, 1000);

    } catch (erro) {
        if (erro instanceof Error) {
            setMensagem(erro.message);
        } else {
            setMensagem("Erro ao conectar com o servidor.");
        }
    }
}


    return (
        <main className="cadastro-container">
            <section className="cadastro-card">
                <h1>Criar conta</h1>
                <p>Cadastre-se na Saúde Animal Agro e Vet</p>

                <form onSubmit={handleSubmit}>
                    <div className="campo">
                        <label htmlFor="nome">Nome completo</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            placeholder="Digite seu nome completo"
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Digite seu e-mail"
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="cpf">CPF</label>
                        <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            placeholder="000.000.000-00"
                            value={cpf}
                            onChange={(event) =>
                                setCpf(formatarCPF(event.target.value))
                            }
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="telefone">Telefone</label>
                        <input
                            type="tel"
                            id="telefone"
                            name="telefone"
                            placeholder="(00) 00000-0000"
                            value={telefone}
                            onChange={(event) =>
                                setTelefone(formatarTelefone(event.target.value))
                            }
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="senha">Senha</label>

                        <div className="senha-input-wrapper">
                            <input
                                type={mostrarSenha ? "text" : "password"}
                                id="senha"
                                name="senha"
                                placeholder="Crie uma senha"
                                value={senha}
                                onChange={(event) => setSenha(event.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="btn-mostrar-senha"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                aria-label={
                                    mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                                }
                            >
                                <i
                                    className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"
                                        }`}
                                ></i>
                            </button>
                        </div>
                    </div>

                    <div className="campo">
                        <label htmlFor="confirmarSenha">Confirmar senha</label>

                        <div className="senha-input-wrapper">
                            <input
                                type={mostrarConfirmarSenha ? "text" : "password"}
                                id="confirmarSenha"
                                name="confirmarSenha"
                                placeholder="Digite a senha novamente"
                                value={confirmarSenha}
                                onChange={(event) => setConfirmarSenha(event.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="btn-mostrar-senha"
                                onClick={() =>
                                    setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                                }
                                aria-label={
                                    mostrarConfirmarSenha
                                        ? "Ocultar confirmação de senha"
                                        : "Mostrar confirmação de senha"
                                }
                            >
                                <i className={`bi ${mostrarConfirmarSenha ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </button>
                        </div>
                    </div>

                    {mensagem && (
                        <p className="mensagem-cadastro" role="status">
                            {mensagem}
                        </p>
                    )}

                    <button type="submit">Cadastrar</button>
                </form>

                <p className="login-link">
                    Já tem uma conta? <a href="/login">Entrar</a>
                </p>
            </section>
        </main>
    );
}

export default Cadastro;