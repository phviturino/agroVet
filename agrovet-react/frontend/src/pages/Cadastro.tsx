import { useState, type SyntheticEvent } from "react";
import "./Cadastro.css";

function Cadastro() {
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

        function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        if (senha !== confirmarSenha) {
            setMensagem("As senhas não são iguais. Por favor verifique e tente novamente.");
            return;
        }

        setMensagem("Cadastro realizado com sucesso!");
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
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="senha">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            placeholder="Crie uma senha"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="confirmarSenha">Confirmar senha</label>
                        <input
                            type="password"
                            id="confirmarSenha"
                            name="confirmarSenha"
                            placeholder="Digite a senha novamente"
                            value={confirmarSenha}
                            onChange={(event) => setConfirmarSenha(event.target.value)}
                            required
                        />
                    </div>

                    {mensagem && (
                        <p className="mensagem-cadastro" role="status">{mensagem}</p>
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