export interface IApiResponse<T> {
    sucesso: boolean;
    mensagem: string;
    dados: T;
}