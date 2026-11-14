import { validarCPF } from "../utils/validarCPF";

export type TipoUsuario = "admin" | "cliente";

export abstract class Usuario {
    #nome!: string;
    #email!: string;
    #cpf!: string;
    #telefone!: string;

    constructor(
        nome: string,
        email: string,
        cpf: string,
        telefone: string
    ) {
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.telefone = telefone;
    }

    get nome(): string {
        return this.#nome;
    }

    get email(): string {
        return this.#email;
    }

    get cpf(): string {
        return this.#cpf;
    }

    get telefone(): string {
        return this.#telefone;
    }

    set nome(valor: string) {
        if (typeof valor !== "string" || !valor.trim()) {
            throw new Error("O nome não pode estar vazio!");
        }
        this.#nome = valor.trim();
    }

    set email(valor: string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (typeof valor !== "string" || !regex.test(valor.trim())) {
            throw new Error("Formato de e-mail inválido!");
        }
        this.#email = valor.trim();
    }

    set cpf(valor: string) {
        if (typeof valor !== "string" || !validarCPF(valor)) {
            throw new Error("CPF inválido!");
        }
        this.#cpf = valor.replace(/\D/g, "");
    }

    set telefone(valor: string) {
        if (typeof valor !== "string") {
            throw new Error("Telefone inválido!");
        }

        const limpo = valor.replace(/\D/g, "");

        if (limpo.length < 10 || limpo.length > 11) {
            throw new Error("Telefone inválido!");
        }

        this.#telefone = limpo;
    }

    abstract get tipoUsuario(): TipoUsuario;

    abstract podeGerenciarProdutos(): boolean;
}
