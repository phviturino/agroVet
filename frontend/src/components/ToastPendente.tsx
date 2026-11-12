
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ToastPendente() {
  useEffect(() => {
    const mensagem = sessionStorage.getItem("toastPendente");

    if (!mensagem) return;

    sessionStorage.removeItem("toastPendente");

    toast.success(mensagem, {
      toastId: "login-sucesso",
      autoClose: 3000
    });
  }, []);

  return null;
}
