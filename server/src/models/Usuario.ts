
import { validarCPF } from "../utils/validarCPF";

export class Usuario {
    // ATRIBUTOS PRIVADOS
    #nome!: string;
    #email!: string;
    #cpf!: string;

    // CONSTRUTOR
    constructor(nome: string, email: string, cpf: string) {
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
    }

    // GETTERS
    get nome(): string {
        return this.#nome;
    }

    get email(): string {
        return this.#email;
    }

    get cpf(): string {
        return this.#cpf;
    }

    // SETTERS
    set nome(novoNome: string) {
        if (typeof novoNome !== "string" || !novoNome.trim()) {
            throw new Error("O nome não pode estar vazio!");
        }

        this.#nome = novoNome.trim();
    }

    set email(novoEmail: string) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            typeof novoEmail !== "string" ||
            !regexEmail.test(novoEmail.trim())
        ) {
            throw new Error("Formato de e-mail inválido!");
        }

        this.#email = novoEmail.trim();
    }

    set cpf(novoCPF: string) {
        if (typeof novoCPF !== "string" || !validarCPF(novoCPF)) {
            throw new Error("CPF inválido!");
        }

        this.#cpf = novoCPF.replace(/\D/g, "");
    }
}
