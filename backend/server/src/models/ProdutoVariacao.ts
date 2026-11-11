export class ProdutoVariacao {
    #idVariacao!: number;
    #idProduto!: number;
    #descricaoVariacao!: string;
    #preco!: number;

    constructor(
        idVariacao: number,
        idProduto: number,
        descricaoVariacao: string,
        preco: number
    ) {
        if (!Number.isInteger(idVariacao) || idVariacao <= 0) {
            throw new Error("ID da variação inválido!");
        }

        if (!Number.isInteger(idProduto) || idProduto <= 0) {
            throw new Error("ID do produto inválido!");
        }

        this.#idVariacao = idVariacao;
        this.#idProduto = idProduto;
        this.descricaoVariacao = descricaoVariacao;
        this.preco = preco;
    }

    get idVariacao(): number {
        return this.#idVariacao;
    }

    get idProduto(): number {
        return this.#idProduto;
    }

    get descricaoVariacao(): string {
        return this.#descricaoVariacao;
    }

    set descricaoVariacao(valor: string) {
        if (typeof valor !== "string" || !valor.trim()) {
            throw new Error("Descrição da variação é obrigatória!");
        }

        this.#descricaoVariacao = valor.trim();
    }

    get preco(): number {
        return this.#preco;
    }

    set preco(valor: number) {
        if (!Number.isFinite(valor) || valor < 0) {
            throw new Error("Preço da variação inválido!");
        }

        this.#preco = valor;
    }
}
