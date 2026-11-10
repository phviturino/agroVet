
import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    function validarEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validarEmail(email.trim())) {
            setMensagem("E-mail inválido. Verifique e tente novamente.");
            return;
        }

        if (!senha.trim()) {
            setMensagem("Informe sua senha para continuar.");
            return;
        }

        setMensagem("Verificando credenciais...");
        setCarregando(true);

        try {
            const resposta = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    senha,
                }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                setMensagem(dados.mensagem || "E-mail ou senha incorretos.");
                return;
            }

            if (!dados.token) {
                setMensagem("Não foi possível concluir a autenticação.");
                return;
            }

            sessionStorage.setItem("token", dados.token);
            setMensagem("Login realizado com sucesso!");
            navigate("/");

        } catch {
            setMensagem("Não foi possível conectar ao servidor. Tente novamente.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="login-container">
            <section className="login-card">
                <h1>Entrar</h1>
                <p>Acesse sua conta na Saúde Animal Agro e Vet</p>

                <form onSubmit={handleSubmit}>
                    <div className="campo">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
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
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(event) => setSenha(event.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="btn-mostrar-senha"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            >
                                <i
                                    className={`bi ${mostrarSenha ? "bi-eye-slash" : "bi-eye"}`}
                                ></i>
                            </button>
                        </div>
                    </div>

                    {mensagem && (
                        <p className="mensagem-login" role="status">
                            {mensagem}
                        </p>
                    )}

                    <button type="submit" disabled={carregando}>
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p className="cadastro-link">
                    Ainda não tem uma conta? <a href="/cadastro">Cadastre-se</a>
                </p>
            </section>
        </main>
    );
}

export default Login;
