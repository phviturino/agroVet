
import { Usuario, type TipoUsuario } from "./Usuario";

export class Cliente extends Usuario {
    get tipoUsuario(): TipoUsuario {
        return "cliente";
    }

    podeGerenciarProdutos(): boolean {
        return false;
    }
}
