import { useState, type SyntheticEvent } from "react";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    function validarEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
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

                <button type="submit">Entrar</button>
            </form>

            <p className="cadastro-link">
                Ainda não tem uma conta? <a href="/cadastro">Cadastre-se</a>
            </p>
        </section>
        </main >
    );
}

export default Login;
