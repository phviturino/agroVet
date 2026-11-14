import { Usuario, type TipoUsuario } from "./Usuario";

export class Administrador extends Usuario {
    get tipoUsuario(): TipoUsuario {
        return "admin";
    }

    podeGerenciarProdutos(): boolean {
        return true;
    }
}
