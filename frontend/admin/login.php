<?php
session_start();

require_once __DIR__ . '/../includes/conexao.php';

if (isset($_SESSION['admin_id'])) {
    header('Location: /agrovet/admin/listar/categoria.php');
    exit;
}

$erro = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';

    if ($email === '' || $senha === '') {
        $erro = 'Preencha o e-mail e a senha.';
    } else {

        $sql = "SELECT id, email, senha FROM administrador WHERE email = ? LIMIT 1";

        $stmt = mysqli_prepare($conexao, $sql);
        mysqli_stmt_bind_param($stmt, 's', $email);
        mysqli_stmt_execute($stmt);

        $resultado = mysqli_stmt_get_result($stmt);
        $administrador = mysqli_fetch_assoc($resultado);

        if ($administrador && password_verify($senha, $administrador['senha'])) {

            session_regenerate_id(true);

            $_SESSION['admin_id'] = $administrador['id'];
            $_SESSION['admin_email'] = $administrador['email'];

            header('Location: /agrovet/admin/listar/categoria.php');
            exit;

        } else {
            $erro = 'E-mail ou senha incorretos.';
        }

        mysqli_stmt_close($stmt);
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Login Admin - Saúde Animal Agro e Vet</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">

    <main class="container d-flex justify-content-center align-items-center min-vh-100">

        <div class="card shadow p-4" style="width: 100%; max-width: 400px;">

            <div class="text-center mb-4">
                <h2>Área Administrativa</h2>
                <p class="text-muted mb-0">
                    Saúde Animal Agro e Vet
                </p>
            </div>

            <?php if ($erro !== ''): ?>
                <div class="alert alert-danger">
                    <?php echo htmlspecialchars($erro); ?>
                </div>
            <?php endif; ?>

            <form method="POST">

                <div class="mb-3">
                    <label for="email" class="form-label">
                        E-mail
                    </label>

                    <input
                        type="email"
                        class="form-control"
                        id="email"
                        name="email"
                        required
                        value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                </div>

                <div class="mb-3">
                    <label for="senha" class="form-label">
                        Senha
                    </label>

                    <input
                        type="password"
                        class="form-control"
                        id="senha"
                        name="senha"
                        required>
                </div>

                <button type="submit" class="btn btn-success w-100">
                    Entrar
                </button>

            </form>

            <div class="text-center mt-3">
                <a href="../index.php" class="text-decoration-none">
                    Voltar para o site
                </a>
            </div>

        </div>

    </main>

</body>

</html>