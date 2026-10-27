import express from "express";
import bcrypt from "bcrypt";
import { banco } from "./database";
import { Usuario } from "./models/Usuario";

const app = express();

app.use(express.json());

// ROTA INICIAL
app.get("/", (req, res) => {
    res.send("API AgroVet funcionando!");
});

// VALIDAÇÃO DE SENHA
function validarSenha(senha: string): boolean {
    const tamanhoMinimo = senha.length >= 8;
    const letraMaiuscula = /[A-Z]/.test(senha);
    const letraMinuscula = /[a-z]/.test(senha);
    const numero = /[0-9]/.test(senha);
    const caractereEspecial = /[^A-Za-z0-9]/.test(senha);

    return (
        tamanhoMinimo &&
        letraMaiuscula &&
        letraMinuscula &&
        numero &&
        caractereEspecial
    );
}

// CADASTRO DE USUÁRIOS
app.post("/usuarios", async (req, res) => {
    const { nome, email, senha, cpf } = req.body ?? {};

    // VERIFICAÇÃO DOS CAMPOS OBRIGATÓRIOS
    if (
        typeof nome !== "string" || !nome.trim() ||
        typeof email !== "string" || !email.trim() ||
        typeof senha !== "string" || !senha ||
        typeof cpf !== "string" || !cpf.trim()
    ) {
        return res.status(400).json({
            mensagem: "Todos os campos são obrigatórios!"
        });
    }

    // VALIDAÇÃO DO NÍVEL DE SENHA
    if (!validarSenha(senha)) {
        return res.status(400).json({
            mensagem: "A senha não atende aos requisitos de segurança!"
        });
    }

    try {
        // CRIAÇÃO DO OBJETO USUÁRIO
        // O construtor executa as validações de nome, email e CPF.
        const usuario = new Usuario(nome, email, cpf);

        // CRIPTOGRAFIA DA SENHA
        const senhaHash = await bcrypt.hash(senha, 12);

        // INSERÇÃO NO BANCO DE DADOS
        await banco.execute(
            `INSERT INTO usuario (nome, email, cpf, senha)
             VALUES (?, ?, ?, ?)`,
            [
                usuario.nome,
                usuario.email,
                usuario.cpf,
                senhaHash
            ]
        );

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!"
        });

    } catch (erro: unknown) {

        // ERROS DE VALIDAÇÃO DA CLASSE USUÁRIO
        if (erro instanceof Error && (
            erro.message === "O nome não pode estar vazio!" ||
            erro.message === "Formato de e-mail inválido!" ||
            erro.message === "CPF inválido!"
        )) {
            return res.status(400).json({
                mensagem: erro.message
            });
        }

        // ERROS DE DUPLICIDADE NO MYSQL
        const erroBanco = erro as { code?: string };

        if (erroBanco.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: "E-mail ou CPF já cadastrado!"
            });
        }

        console.error("Erro ao cadastrar usuário:", erro);

        return res.status(500).json({
            mensagem: "Erro interno ao cadastrar usuário!"
        });
    }
});

// INICIALIZAÇÃO DO SERVIDOR
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// TESTE DE CONEXÃO COM MYSQL
async function testarConexao() {
    try {
        const conexao = await banco.getConnection();

        console.log("Conexão com MySQL realizada com sucesso!");

        conexao.release();

    } catch (erro) {
        console.error("Erro ao conectar ao MySQL:", erro);
    }
}

testarConexao();
