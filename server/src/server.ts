
import express from "express";
import bcrypt from "bcrypt";
import { banco } from "./database";

const app = express();

app.use(express.json());




app.get("/", (req, res) => {
    res.send("API AgroVet funcionando!");
});




function validarCPF(cpf: string): boolean {
    const numeros = cpf.replace(/\D/g, "");

    if (numeros.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(numeros)) {
        return false;
    }

    for (let digito = 9; digito < 11; digito++) {
        let soma = 0;

        for (let i = 0; i < digito; i++) {
            soma += Number(numeros[i]) * (digito + 1 - i);
        }

        const resto = (soma * 10) % 11;
        const verificador = resto === 10 ? 0 : resto;

        if (verificador !== Number(numeros[digito])) {
            return false;
        }
    }

    return true;
}




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



app.post("/usuarios", async (req, res) => {
    const { nome, email, senha, cpf } = req.body ?? {};

    // Verifica os campos obrigatórios
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

    // Valida o formato do e-mail
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email.trim())) {
        return res.status(400).json({
            mensagem: "Formato de e-mail inválido!"
        });
    }

    // Valida o CPF
    if (!validarCPF(cpf)) {
        return res.status(400).json({
            mensagem: "CPF inválido!"
        });
    }

    // Valida a senha
    if (!validarSenha(senha)) {
        return res.status(400).json({
            mensagem: "A senha não atende aos requisitos de segurança!"
        });
    }




    try {
        // Remove pontos e traços do CPF
        const cpfLimpo = cpf.replace(/\D/g, "");

        // Gera um hash seguro da senha
        const senhaHash = await bcrypt.hash(senha, 12);

        // Insere os dados na tabela usuario
        await banco.execute(
            `INSERT INTO usuario (nome, email, cpf, senha)
             VALUES (?, ?, ?, ?)`,
            [
                nome.trim(),
                email.trim(),
                cpfLimpo,
                senhaHash
            ]
        );

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!"
        });

    } catch (erro: unknown) {
        const erroBanco = erro as { code?: string };

        // E-mail ou CPF duplicado
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


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});



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
