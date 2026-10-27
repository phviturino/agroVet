
export function validarCPF(cpf: string): boolean {
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
