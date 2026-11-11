import { ProdutoVariacao } from './ProdutoVariacao';
import type { IProduto } from '../interfaces/IProduto';
import type { PrecoProduto } from '../types/ProdutoType';

export class Produto implements IProduto {
    #idCategoria!: number;
    #nome!: string;
    #preco!: PrecoProduto;
    #estoque!: number | null;
    #imagem!: string | null;
    #descricao!: string | null;
    #variacoes: ProdutoVariacao[] = [];

    constructor(
        idCategoria: number,
        nome: string,
        preco: PrecoProduto = null,
        estoque: number | null = null,
        imagem: string | null = null,
        descricao: string | null = null
    ) {
        this.idCategoria = idCategoria;
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
        this.imagem = imagem;
        this.descricao = descricao;
    }

    get idCategoria(): number {
        return this.#idCategoria;
    }

    set idCategoria(valor: number) {
        if (!Number.isInteger(valor) || valor <= 0) {
            throw new Error("Categoria inválida!");
        }
        this.#idCategoria = valor;
    }

    get nome(): string {
        return this.#nome;
    }

    set nome(valor: string) {
        if (typeof valor !== "string" || !valor.trim()) {
            throw new Error("Nome do produto é obrigatório!");
        }
        this.#nome = valor.trim();
    }

    get preco(): PrecoProduto {
        return this.#preco;
    }

    set preco(valor: PrecoProduto) {
        if (valor !== null && (!Number.isFinite(valor) || valor < 0)) {
            throw new Error("Preço inválido!");
        }
        this.#preco = valor;
    }

    get estoque(): number | null {
        return this.#estoque;
    }

    set estoque(valor: number | null) {
        if (valor !== null && (!Number.isInteger(valor) || valor < 0)) {
            throw new Error("Estoque inválido!");
        }
        this.#estoque = valor;
    }

    get imagem(): string | null {
        return this.#imagem;
    }

    set imagem(valor: string | null) {
        this.#imagem = valor;
    }

    get descricao(): string | null {
        return this.#descricao;
    }

    set descricao(valor: string | null) {
        this.#descricao = valor;
    }

    adicionarVariacao(variacao: ProdutoVariacao): void {
        if (!(variacao instanceof ProdutoVariacao)) {
            throw new Error("Variação inválida!");
        }

        this.#variacoes.push(variacao);
    }

    get variacoes(): ProdutoVariacao[] {
        return [...this.#variacoes];
    }


}
