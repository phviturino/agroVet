
import { useState, type SyntheticEvent } from "react";
import { toast } from "react-toastify";
import { validarCPF } from "../utils/validarCPF";
import "./Cadastro.css";

function Cadastro() {
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [carregando, setCarregando] = useState(false);

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

    function validarEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    function validarSenhaForte(valor: string): boolean {
        return (
            valor.length >= 8 &&
            /[A-Z]/.test(valor) &&
            /[a-z]/.test(valor) &&
            /[0-9]/.test(valor) &&
            /[^A-Za-z0-9]/.test(valor)
        );
    }

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        if (carregando) return;

        const formulario = new FormData(event.currentTarget);

        const nome = String(formulario.get("nome") ?? "").trim();
        const email = String(formulario.get("email") ?? "").trim();

        if (!nome) {
            toast.warning("Informe seu nome completo.");
            return;
        }

        if (!validarCPF(cpf.replace(/\D/g, ""))) {
            toast.warning("CPF inválido. Verifique os números informados.");
            return;
        }

        if (!validarEmail(email)) {
            toast.warning("Informe um endereço de e-mail válido.");
            return;
        }

        const telefoneLimpo = telefone.replace(/\D/g, "");

        if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
            toast.warning("Informe um telefone válido com DDD.");
            return;
        }

        if (!validarSenhaForte(senha)) {
            toast.warning(
                "A senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e símbolo."
            );
            return;
        }

        if (senha !== confirmarSenha) {
            toast.warning("As senhas não coincidem. Verifique e tente novamente.");
            return;
        }

        const dados = {
            nome,
            email,
            cpf: cpf.replace(/\D/g, ""),
            telefone: telefoneLimpo,
            senha
        };

        setCarregando(true);

        try {
            const resposta = await fetch("/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                toast.error(
                    resultado.mensagem || "Não foi possível realizar o cadastro."
                );
                return;
            }

            sessionStorage.setItem(
                "toastPendente",
                "Cadastro realizado com sucesso! Faça login para continuar."
            );

            window.location.assign("/login");
        } catch (erro) {
            console.error("Erro ao cadastrar usuário:", erro);

            toast.error("Erro ao conectar com o servidor. Tente novamente.");
        } finally {
            setCarregando(false);
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
                            disabled={carregando}
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
                            disabled={carregando}
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
                            maxLength={14}
                            disabled={carregando}
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
                            maxLength={15}
                            disabled={carregando}
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
                                disabled={carregando}
                                required
                            />

                            <button
                                type="button"
                                className="btn-mostrar-senha"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                disabled={carregando}
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
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
                                onChange={(event) =>
                                    setConfirmarSenha(event.target.value)
                                }
                                disabled={carregando}
                                required
                            />

                            <button
                                type="button"
                                className="btn-mostrar-senha"
                                onClick={() =>
                                    setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                                }
                                disabled={carregando}
                                aria-label={
                                    mostrarConfirmarSenha
                                        ? "Ocultar confirmação de senha"
                                        : "Mostrar confirmação de senha"
                                }
                            >
                                <i
                                    className={`bi ${mostrarConfirmarSenha ? "bi-eye-slash" : "bi-eye"
                                        }`}
                                ></i>
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={carregando}>
                        {carregando ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </form>

                <p className="login-link">
                    Já tem uma conta? <a href="/login">Entrar</a>
                </p>
            </section>
        </main>
    );
}

export default Cadastro;
