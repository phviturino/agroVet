-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 12/11/2026 às 21:03
-- Versão do servidor: 10.11.16-MariaDB
-- Versão do PHP: 8.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `saudeanimal_novo`
--

DELIMITER $$
--
-- Procedimentos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_listar_produtos` (IN `p_categoria` INT, IN `p_busca` VARCHAR(100), IN `p_limite` INT, IN `p_offset` INT)   BEGIN
    SELECT produto.*, categoria.nome AS categoria_nome
    FROM produto
    JOIN categoria ON produto.id_categoria = categoria.id
    WHERE (p_categoria IS NULL OR produto.id_categoria = p_categoria)
      AND (p_busca IS NULL OR produto.nome LIKE CONCAT('%', p_busca, '%'))
    LIMIT p_limite OFFSET p_offset;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_produtos_destaque` ()   begin
    select * from produto where id in (13, 68, 133, 161, 221, 254, 297, 338) limit 8;
end$$

--
-- Funções
--
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_preco_pix` (`preco` DECIMAL(10,2)) RETURNS DECIMAL(10,2) DETERMINISTIC begin
	return preco * 0.95;
end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `administrador`
--

CREATE TABLE `administrador` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `administrador`
--

INSERT INTO `administrador` (`id`, `email`, `senha`) VALUES
(1, 'admin@saudeanimal.com', '$2y$10$UGbyWGC4.qMNZ4ILk/tj6ukHEI9QKFzTqKRI0SvMRG4a.4.mR3nMe');

-- --------------------------------------------------------

--
-- Estrutura para tabela `avaliacao`
--

CREATE TABLE `avaliacao` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `nota` tinyint(4) NOT NULL,
  `comentario` text DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `avaliacao`
--

INSERT INTO `avaliacao` (`id`, `id_usuario`, `id_produto`, `nota`, `comentario`, `criado_em`) VALUES
(2, 20, 348, 5, 'teste', '2026-11-11 22:23:36'),
(3, 20, 435, 5, 'teste', '2026-11-11 22:24:12'),
(4, 20, 459, 1, 'teste', '2026-11-11 22:24:22'),
(5, 20, 109, 3, 'teste', '2026-11-11 22:24:38'),
(6, 20, 310, 4, 'teste', '2026-11-11 22:24:52'),
(7, 20, 412, 4, 'teste', '2026-11-11 22:25:01'),
(8, 20, 63, 5, 'teste', '2026-11-11 22:25:11'),
(9, 20, 137, 5, 'teste', '2026-11-11 22:25:29'),
(10, 20, 75, 2, 'teste', '2026-11-11 22:25:38'),
(11, 20, 377, 2, 'teste', '2026-11-11 22:25:55'),
(12, 20, 434, 3, 'teste', '2026-11-11 22:26:22'),
(13, 20, 105, 5, NULL, '2026-11-11 22:27:49');

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria`
--

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descrição` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `categoria`
--

INSERT INTO `categoria` (`id`, `nome`, `descrição`) VALUES
(8, 'Pecuária', 'Rações e insumos'),
(9, 'Pet', 'Produtos para pets'),
(10, 'Medicamentos', 'Medicamentos veterinários'),
(11, 'EPIs', 'Equipamentos de proteção individual'),
(12, 'Jardinagem', 'Plantas, sementes, ferramentas e inseticidas'),
(13, 'Aventura e Lazer', 'Tereré, chimarrão, churrasco e pesca'),
(14, 'Equipamentos', 'Pulverizadores, motosserra, e ferramentas'),
(15, 'Vestuário', 'Roupas, chapéus, cintos, facas e acessórios');

-- --------------------------------------------------------

--
-- Estrutura para tabela `fornecedor`
--

CREATE TABLE `fornecedor` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `cnpj` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `fornecedor`
--

INSERT INTO `fornecedor` (`id`, `nome`, `telefone`, `email`, `cnpj`) VALUES
(1, 'special dog', '44 1234-567', 'contato@specialdog.com.br', NULL),
(2, 'basso pancotte', '44 1234-567', 'contato@basso.com.br', NULL),
(3, 'trots', '44 1234-567', 'trots@contato.com.br', NULL),
(4, 'erva black', '44 1234-567', 'contato@black.com.br', NULL),
(5, 'algomix', '44 1234-567', 'algomix@contato.com.br', NULL),
(6, 'agraria', '44 1234-567', 'agraria@contato.com.br', NULL),
(7, 'supra', '44 1234-567', 'supra@contato.com.br', NULL),
(8, 'perro', '44 1234-567', 'contato@perro.com.br', NULL),
(9, 'Plantar', '44 1234-5678', 'contato@plantar.com.br', NULL),
(10, 'SP', '44 1234-5678', 'contato@sprural.com.br', NULL),
(11, 'Zoetis', '44 1234-5678', 'contato@zoetis.com.br', NULL),
(12, 'Agrodomus', '44 1234-5678', 'contato@agrodomus.com.br', NULL),
(13, 'Integrada', '44 1234-5678', 'contato@integrada.com.br', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `fornecedor_produto`
--

CREATE TABLE `fornecedor_produto` (
  `id_produto` int(11) NOT NULL,
  `id_fornecedor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `fornecedor_produto`
--

INSERT INTO `fornecedor_produto` (`id_produto`, `id_fornecedor`) VALUES
(13, 4),
(14, 3),
(15, 3),
(16, 10),
(17, 10),
(18, 1),
(19, 1),
(20, 1),
(21, 8),
(22, 8),
(23, 8),
(29, 10),
(31, 10),
(32, 10),
(33, 10),
(35, 2),
(36, 2),
(37, 2),
(38, 2),
(39, 2),
(41, 2),
(42, 2),
(43, 2),
(44, 2),
(45, 2),
(47, 2),
(48, 2),
(49, 2),
(50, 2),
(51, 2),
(53, 9),
(54, 5),
(55, 5),
(57, 9),
(58, 9),
(59, 9),
(60, 9),
(61, 9),
(62, 9),
(63, 8),
(64, 8),
(65, 11),
(66, 11),
(67, 11),
(68, 11),
(69, 11),
(70, 11),
(71, 10),
(72, 10),
(73, 10),
(74, 10),
(75, 2),
(76, 2),
(77, 2),
(78, 2),
(79, 2),
(80, 2),
(81, 2),
(82, 10),
(83, 10),
(84, 9),
(84, 12),
(85, 5),
(88, 2),
(89, 2),
(90, 2),
(91, 2),
(92, 2),
(93, 2),
(94, 2),
(95, 6),
(96, 10),
(97, 10),
(98, 2),
(99, 2),
(100, 2),
(101, 2),
(101, 6),
(102, 2),
(102, 6),
(103, 10),
(104, 10),
(105, 13),
(106, 13),
(107, 13),
(108, 10),
(109, 5),
(110, 7),
(111, 5),
(112, 5),
(113, 5),
(114, 5),
(115, 5),
(116, 7),
(118, 1),
(119, 8),
(120, 10),
(121, 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto`
--

CREATE TABLE `produto` (
  `id` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `preço` decimal(10,2) DEFAULT NULL,
  `estoque` int(11) DEFAULT NULL,
  `imagem` varchar(100) DEFAULT NULL,
  `descricao` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produto`
--

INSERT INTO `produto` (`id`, `id_categoria`, `nome`, `preço`, `estoque`, `imagem`, `descricao`) VALUES
(13, 13, 'Erva Black Double Black', 25.00, 50, 'double.black.jpeg', '**Erva-Mate para Tererê Black Erva Double Black**\r\n\r\nErva-mate premium desenvolvida para proporcionar um sabor intenso, aroma marcante e refrescância equilibrada. Produzida com erva-mate selecionada, é ideal para quem busca uma experiência diferenciada no tererê, oferecendo excelente qualidade e rendimento em cada preparo.\r\n'),
(14, 13, 'Erva Trots Menta Stronger', 25.00, 50, 'trots.mentastronger.webp', '**Erva-Mate para Tererê Trot\'s Menta Stronger 500g**\r\n\r\nErva-mate para tererê elaborada com folhas e partes selecionadas da erva-mate, combinadas com menta de sabor intenso. Proporciona uma experiência marcante e refrescante, ideal para quem aprecia um tererê com forte presença de menta e excelente sabor.\r\n'),
(15, 13, 'Erva Trots Limão Caipira', 25.00, 50, 'trots.limao.webp', 'Erva-Mate para Tererê TROT\'S Limão Caipira 500g\r\n\r\nErva-mate selecionada combinada ao sabor marcante e refrescante do limão caipira. Proporciona uma experiência equilibrada entre a intensidade da erva-mate e o toque cítrico do limão, sendo uma excelente opção para quem aprecia um tererê autêntico e saboroso.'),
(16, 13, 'Garrafa Stanley Jug', 599.00, 10, 'jug.webp', 'rrafa Jug Térmica Stanley 7,5L\r\n\r\nGarrafa térmica de alta capacidade, ideal para manter bebidas geladas durante momentos de lazer, viagens, acampamentos e encontros. Possui parede dupla com isolamento térmico, alça resistente para transporte e torneira de alto fluxo, proporcionando praticidade para servir bebidas. A Stanley informa conservação de bebidas geladas por até 13 horas e, com gelo, por até 48 horas'),
(17, 14, 'Canivete Ariat Inox Com Trava', 90.00, 5, 'canivete.ariat.png', 'Canivete dobrável produzido em aço inoxidável, com estrutura compacta e resistente. Possui sistema de trava para maior segurança durante o armazenamento e transporte, sendo uma opção prática para atividades que exigem uma ferramenta portátil e versátil.'),
(18, 9, 'Ração Special Dog Carne', 11.00, 40, 's.d.carne.png', 'Ração Special Dog Carne\r\n\r\nAlimento completo e balanceado para cães, desenvolvido com ingredientes selecionados e sabor de carne para proporcionar uma refeição saborosa e nutritiva. Sua fórmula contribui para a manutenção da saúde, energia e bem-estar dos cães, sendo uma opção adequada para a alimentação diária.'),
(19, 9, 'Ração Special Dog Bionatural Señior 7+', 20.00, 40, 's.d.senior.png', 'Ração Special Dog BioNatural Sênior 7+\r\n\r\nAlimento completo e balanceado desenvolvido especialmente para cães a partir de 7 anos. Elaborado por veterinários com carne fresca, ingredientes 100% naturais e livre de transgênicos, sua fórmula oferece nutrientes selecionados para atender às necessidades da fase sênior, contribuindo para a saúde, vitalidade e bem-estar do seu cão.'),
(20, 9, 'Ração Special Dog Ultralife Adulto Raças Pequenas', 14.00, 40, 'adulto.rp.png', 'Ração Special Dog Ultralife Adulto Raças Pequenas\r\n\r\nAlimento completo e balanceado desenvolvido especialmente para cães adultos de raças pequenas. Sua fórmula fornece nutrientes essenciais para auxiliar na manutenção da energia, saúde muscular, digestão e bem-estar, proporcionando uma alimentação adequada para a rotina dos pequenos cães.'),
(21, 9, 'Ração Special Cat Bionatural Castrado Salmão', 20.00, 40, 'bionatural.castrado.png', 'Ração Special Cat BioNatural Castrado Salmão\r\n\r\nAlimento completo e balanceado desenvolvido especialmente para gatos castrados, com sabor de salmão e nutrientes selecionados para atender às necessidades dessa fase. Elaborado por veterinários com carne fresca, ingredientes 100% naturais e livre de transgênicos, contribui para a manutenção da saúde, vitalidade e bem-estar dos felinos.'),
(22, 9, 'Ração Special Cat Castrado', 18.50, 40, 's.c.castrado.png', 'Ração Special Cat Castrado\r\n\r\nAlimento completo e balanceado desenvolvido especialmente para gatos castrados, com nutrientes selecionados para atender às necessidades dessa fase. Sua fórmula contribui para a manutenção da saúde, controle do peso corporal e bem-estar, proporcionando uma alimentação saborosa e adequada para o dia a dia dos felinos.'),
(23, 9, 'Ração Special Cat Carne', 16.50, 40, 's.c.carne.png', 'Ração Special Cat Carne\r\n\r\nAlimento completo e balanceado desenvolvido para gatos, com sabor de carne e nutrientes essenciais para uma alimentação saudável e equilibrada. Sua fórmula contribui para a manutenção da saúde, vitalidade e bem-estar dos felinos, proporcionando uma refeição saborosa para o dia a dia.'),
(29, 9, 'Mantas Pet', 25.00, 30, 'manta-pet.webp', 'Mantas Pet\r\n\r\nMantas desenvolvidas para proporcionar conforto e aconchego aos pets durante os momentos de descanso. Ideais para cães e gatos, ajudam a manter o animal aquecido e confortável, além de serem práticas para o uso no dia a dia.'),
(31, 9, 'Shampoo Para Equinos 5L', 25.90, 40, 'shampoo.jpeg', 'Shampoo para Equinos 5L\r\n\r\nShampoo desenvolvido especialmente para a higiene de equinos, proporcionando limpeza eficiente da pele e da pelagem. Sua fórmula auxilia na remoção de sujeiras e impurezas, deixando os pelos limpos, macios e com brilho, sendo ideal para a rotina de cuidados e manutenção do animal.'),
(32, 13, 'Kit Copo e Bomba Criado de Vó', 89.90, 10, 'kit.criado.de.vo.jpeg', 'Kit Copo e Bomba Criado de Vó\r\n\r\nKit tradicional para preparo e consumo de tererê, composto por copo e bomba, unindo praticidade e estilo em um conjunto completo. Ideal para quem aprecia o tererê no dia a dia e busca um kit funcional para acompanhar bons momentos.'),
(33, 15, 'Bainha', 49.90, 20, 'bainha.jpeg', NULL),
(35, 10, 'Pomada Saralogo', 32.00, 15, 'saralogo.jpg', '**Pomada Saralogo 30g**\r\n\r\nPomada veterinária antisséptica e cicatrizante, indicada para cães e gatos adultos. Auxilia na cicatrização de ferimentos e nos cuidados de afecções da pele, contribuindo para a higiene e recuperação da região afetada.\r\n'),
(36, 10, 'Chemitril 150mg', 68.00, 25, 'Chemitril-150.png', 'Chemitril 150 mg\r\n\r\nAntibiótico veterinário à base de enrofloxacino, indicado para o tratamento de infecções bacterianas sensíveis ao princípio ativo. A apresentação de 150 mg é indicada pela fabricante para cães, incluindo infecções respiratórias, gastrointestinais, dérmicas, urogenitais e otites. É um medicamento de uso sob orientação do médico-veterinário.'),
(37, 10, 'Spray Terracam', 36.00, 20, 'terracam.jpg', '**Terracam Spray 125 mL**\r\n\r\nMedicamento veterinário com ação antimicrobiana e anti-inflamatória, formulado com oxitetraciclina, hidrocortisona e vitamina A. Indicado para o tratamento de ceratoconjuntivite infecciosa em bovinos e ovinos e para o cuidado de dermatites alérgicas de contato em cães, auxiliando na prevenção de infecções bacterianas secundárias e na regeneração da pele.\r\n'),
(38, 10, 'Glicopan Pet', 52.00, 30, 'glicopan.jpg', '**Glicopan Pet**\r\n\r\nSuplemento nutricional desenvolvido para cães, gatos e outras espécies, combinando aminoácidos, vitaminas do complexo B e glicose. Auxilia na suplementação nutricional, na melhora do estado geral, no estímulo do apetite e no suporte energético dos animais.\r\n'),
(39, 10, 'Acura', 70.00, 20, 'acura.png', '**Acura**\r\nAntimicrobiano de uso veterinário pronto para uso, de amplo espectro, indicado para bovinos, equinos e caninos. Frasco com 25mL, ideal para o tratamento de infecções bacterianas com praticidade e segurança na aplicação.'),
(41, 10, 'Catosal B12', 60.00, 15, 'catosal_b12.webp', '**Catosal B12**\r\n\r\nSuplemento injetável à base de fósforo orgânico e vitamina B12, desenvolvido para auxiliar nos processos metabólicos e na suplementação desses nutrientes. Indicado para bovinos, equinos e suínos, conforme orientação do médico-veterinário.\r\n'),
(42, 10, 'Banamine Injetável', 170.00, 15, 'banamine.png', '**Banamine Injetável**\r\n\r\nMedicamento veterinário à base de flunixina meglumina, com ação analgésica, anti-inflamatória e antitérmica. Indicado para equinos e bovinos no controle da dor, febre e processos inflamatórios, conforme orientação do médico-veterinário.\r\n'),
(43, 10, 'Enxofre Pecuário', 20.00, 30, 'enxofre.png', 'Enxofre Pecuário Agronese 1kg\r\n\r\nSuplemento mineral desenvolvido para ruminantes e equinos, fornecendo enxofre para auxiliar nos processos nutricionais e no desenvolvimento da flora ruminal. Contribui para o aproveitamento dos nutrientes e para a manutenção da saúde e do desempenho dos animais, conforme as orientações do fabricante.'),
(44, 10, 'Eloxicam 0,5%', 35.00, 20, 'eloxicam.jpg', 'Elo-xicam 0,5 mg\r\n\r\nMedicamento veterinário à base de meloxicam, com ação anti-inflamatória, analgésica e antitérmica. Indicado para cães e gatos no tratamento de processos inflamatórios e quadros dolorosos agudos, sempre sob orientação do médico-veterinário.'),
(45, 10, 'Eloxicam 2%', 56.00, 15, 'eloxicam2.jpg', 'Elo-xicam 2 mg\r\n\r\nMedicamento veterinário à base de meloxicam, com ação anti-inflamatória, analgésica e antitérmica. Indicado para cães em processos inflamatórios, especialmente aqueles associados a dores agudas. Seu uso deve ser realizado sob orientação do médico-veterinário.'),
(47, 10, 'Mercepton Injetável', 58.00, 15, 'merceptoninj.webp', 'Mercepton Injetável\r\n\r\nMedicamento veterinário de ação hepatoprotetora e antitóxica, composto por aminoácidos, vitaminas do complexo B e glicose. É utilizado como auxiliar em casos de intoxicações, alterações hepáticas e na prevenção ou tratamento de deficiências de vitaminas do complexo B. Indicado para diferentes espécies, conforme avaliação e orientação do médico-veterinário.'),
(48, 10, 'Mercepton Oral', 36.00, 15, 'mercepton-oral.webp', 'Mercepton Oral 20 mL\r\n\r\nMedicamento veterinário indicado para cães e gatos, com ação estimulante do processo digestivo e auxiliar na eliminação de toxinas provenientes de alimentos deteriorados ou de plantas tóxicas ingeridas acidentalmente. Sua fórmula contém acetilmetionina, cloreto de colina, vitaminas do complexo B e outros componentes nutricionais.'),
(49, 10, 'Monovin A', 42.00, 30, 'monovinA.webp', 'Monovin A 20 mL\r\n\r\nSuplemento vitamínico veterinário à base de vitamina A, indicado para prevenção e tratamento da deficiência de vitamina A e suas manifestações em animais. Sua utilização deve seguir a indicação da bula e a orientação do médico-veterinário.'),
(50, 10, 'Monovin B1', 40.00, 30, 'monovinB1.webp', 'Suplemento vitamínico veterinário à base de vitamina B1 (tiamina), indicado para auxiliar no tratamento de estados de deficiência dessa vitamina em animais. É utilizado em diferentes espécies, conforme indicação do fabricante e orientação do médico-veterinário.'),
(51, 10, 'Ivomec', 55.00, 20, 'ivomec.webp', 'Ivomec\r\n\r\nMedicamento veterinário à base de ivermectina, utilizado no controle e tratamento de diferentes parasitas internos e externos em animais, conforme a apresentação e a espécie indicada pelo fabricante. Deve ser utilizado de acordo com a bula e sob orientação do médico-veterinário.'),
(53, 12, 'Vaso Redondo', 29.90, 20, 'vaso.redondo.jpeg', NULL),
(54, 13, 'Iscamix Furadinha', 22.00, 30, 'furadinha.png', 'Iscamix Furadinha\r\n\r\nIsca para pesca desenvolvida para facilitar a preparação e o uso durante a pescaria. Seu formato furadinho permite uma apresentação prática da isca, sendo uma opção versátil para diferentes modalidades de pesca.'),
(55, 13, 'Iscamix Massa', 22.90, 30, 'iscamix.jpeg', 'Iscamix 200g\r\n\r\nMassa para pesca desenvolvida para facilitar a preparação da isca e atrair diferentes espécies de peixes. Disponível em diferentes sabores, como goiaba, bacon e baunilha com coco, oferece praticidade e variedade para diferentes condições de pesca.'),
(56, 12, 'Glifomato Glifosato Insetmax', 36.00, 15, 'glifomato.webp', 'Glifomato Glifosato Insetmax\r\n\r\nHerbicida à base de glifosato, desenvolvido para o controle de plantas daninhas. Produto de uso agrícola, indicado para diferentes situações de manejo da vegetação, devendo ser utilizado exclusivamente conforme as orientações do rótulo e da legislação vigente.'),
(57, 12, 'Calda Max Ouro Garden', 40.00, 20, 'calda-max.jpeg', 'Calda Max Ouro Garden 100 mL\r\n\r\nFertilizante cúprico concentrado desenvolvido para auxiliar na proteção e no fortalecimento das plantas. Sua formulação contribui para a suplementação de cobre e para a manutenção da saúde e do desenvolvimento das plantas, conforme as orientações do fabricante.'),
(58, 12, 'Torta Vegetal Mamona', 15.00, 25, 'torta-vegeral.webp', '**Torta Vegetal (Mamona) 1kg**\r\n\r\nFertilizante orgânico simples à base de torta vegetal de mamona, desenvolvido para auxiliar na fertilidade e na estruturação do solo. Fornece nutrientes e matéria orgânica, contribuindo para o desenvolvimento saudável das plantas e a melhoria das condições do solo.\r\n'),
(59, 12, 'Fertilizante Rosas', 15.90, 30, 'fertilizante.rosas.jpeg', '**Fertilizante Rosas 150g**\r\n\r\nFertilizante mineral misto desenvolvido especialmente para rosas, fornecendo nutrientes essenciais para complementar e repor as necessidades da planta. Auxilia no desenvolvimento saudável e na manutenção de rosas mais vigorosas.\r\n'),
(60, 12, 'Fertilizante Frutas', 15.90, 30, 'fertilizante.frutas.jpeg', '**Fertilizante Frutas**\r\n\r\nFertilizante desenvolvido para fornecer nutrientes essenciais às plantas frutíferas, auxiliando no crescimento, desenvolvimento e manutenção saudável das plantas. Contribui para uma nutrição equilibrada e para o bom desenvolvimento dos frutos, conforme as orientações do fabricante.\r\n'),
(61, 12, 'Fertilizante 20-05-20', 12.90, 30, '20.05.20.jpeg', '**Fertilizante 20-05-20**\r\n\r\nFertilizante mineral formulado com **20% de nitrogênio, 5% de fósforo e 20% de potássio (NPK)**. Fornece nutrientes essenciais para o desenvolvimento das plantas, auxiliando no crescimento vegetativo, fortalecimento e manutenção de uma nutrição equilibrada.\r\n'),
(62, 12, 'Fertilizante Torta Vegetal', 19.90, 25, 'fertilizante.torta.vegetal.jpeg', '**Fertilizante Torta Vegetal + Farinha de Osso 400g**\r\n\r\nFertilizante orgânico organomineral desenvolvido para fornecer **fósforo e cálcio**, nutrientes essenciais ao desenvolvimento e vigor das plantas. Sua composição combina torta vegetal de mamona e farinha de osso, contribuindo para uma nutrição equilibrada e o fortalecimento das plantas.\r\n'),
(63, 9, 'Tapete Higiênico Good Pad', 16.00, 20, 'goodpad.jpg', '**Tapete Higiênico Good Pad**\r\n\r\nTapete higiênico desenvolvido para auxiliar na rotina de higiene de cães, proporcionando praticidade e absorção durante o uso. Ideal para ajudar no treinamento e na manutenção de ambientes mais limpos e confortáveis para o pet.\r\n'),
(64, 9, 'Tapete Higiênico', 65.00, 30, 'tapetehigenico.jpg', '**Tapete Higiênico**\r\n\r\nTapete higiênico desenvolvido para facilitar a rotina de higiene de cães, oferecendo praticidade e absorção para o uso diário. Ideal para auxiliar no treinamento e manter os ambientes mais limpos e confortáveis para o pet.\r\n'),
(65, 10, 'Simparic Trio 20-40kg', 122.50, 20, 'trio 20-40.webp', 'Simparic Trio 20–40 kg\r\n\r\nAntiparasitário veterinário em comprimido mastigável, indicado para cães com peso entre 20,1 e 40 kg. Atua no controle de pulgas e carrapatos e no tratamento de determinados vermes gastrointestinais, além de auxiliar na prevenção da dirofilariose (verme do coração) e do verme pulmonar. Contém sarolaner, moxidectina e pamoato de pirantel.'),
(66, 10, 'Simparic 5mg', 74.20, 25, 'simparic 5.webp', 'Simparic 5 mg\r\n\r\nAntiparasitário veterinário em comprimido mastigável, à base de sarolaner, indicado para cães de 1,3 a 2,5 kg. Auxilia no tratamento e controle de pulgas, carrapatos e sarnas, com administração conforme o peso do animal e orientação do médico-veterinário.'),
(67, 10, 'Simparic 10mg', 77.00, 25, 'simparic 10.webp', 'Simparic 10 mg\r\n\r\nAntiparasitário veterinário em comprimido mastigável, à base de sarolaner, indicado para cães de 2,6 a 5 kg. Atua no controle de pulgas e carrapatos, além de auxiliar no tratamento de diferentes tipos de sarnas. Deve ser administrado conforme o peso do animal e sob orientação do médico-veterinário.'),
(68, 10, 'Simparic 40mg', 99.40, 20, 'simparic 40.webp', 'Simparic 40 mg\r\n\r\nAntiparasitário veterinário em comprimido mastigável, à base de sarolaner, indicado para cães com peso entre 10,1 e 20 kg. Atua no controle de pulgas e carrapatos e no tratamento e controle de diferentes tipos de sarna. Deve ser utilizado conforme a orientação do médico-veterinário.'),
(69, 10, 'Simparic 20mg', 84.00, 20, 'simparic 20.webp', 'Simparic 20 mg\r\n\r\nAntiparasitário veterinário em comprimido mastigável, à base de sarolaner, indicado para cães com peso entre 5,1 e 10 kg. Atua no controle de pulgas e carrapatos e auxilia no tratamento e controle de diferentes tipos de sarnas. Deve ser utilizado conforme o peso do animal e sob orientação do médico-veterinário.'),
(70, 10, 'Simparic 120mg', 115.50, 15, 'simparic 120.webp', '**Simparic 120 mg**\r\n\r\nAntiparasitário veterinário em comprimido mastigável, à base de **sarolaner**, indicado para cães com peso entre **40,1 e 60 kg**. Atua no controle de **pulgas e carrapatos** e auxilia no tratamento e controle de diferentes tipos de sarnas. Deve ser utilizado conforme o peso do animal e sob orientação do médico-veterinário.\r\n'),
(71, 13, 'Garrafa Térmica Revestida de Couro 2,5L', 250.00, 10, 'garrafa.couro.jpeg', 'Garrafa Térmica Revestida de Couro 2,5L\r\n\r\nGarrafa térmica com capacidade de 2,5 litros, revestida em couro para proporcionar um visual elegante e maior proteção durante o uso. Ideal para conservar bebidas na temperatura desejada, sendo uma opção prática para o dia a dia, viagens, encontros e momentos de lazer.'),
(72, 13, 'Garrafa Térmica Chacal 4L', 250.00, 15, 'chacal4L.webp', 'Garrafa Térmica Chacal 4L\r\n\r\nGarrafa térmica com capacidade de 4 litros, desenvolvida para conservar bebidas por mais tempo e facilitar o transporte e o armazenamento. Ideal para uso em casa, viagens, pescarias, acampamentos e momentos de lazer, oferecendo praticidade e boa capacidade para servir bebidas.'),
(73, 13, 'Caixa Térmica 12L', 90.00, 10, 'cx-termica-soprano12L.webp', 'Caixa Térmica 12L\r\n\r\nCaixa térmica com capacidade de 12 litros, desenvolvida para conservar bebidas e alimentos por mais tempo. Compacta e prática, é ideal para passeios, viagens, pescarias, acampamentos e momentos de lazer, facilitando o transporte e a conservação dos produtos.'),
(74, 13, 'Caixa Térmica 32L', 150.00, 10, 'cx-termica-soprano32L.webp', 'Caixa Térmica 32L\r\n\r\nCaixa térmica com capacidade de 32 litros, desenvolvida para conservar bebidas e alimentos por mais tempo. Seu espaço interno oferece boa capacidade para transportar e armazenar itens, sendo ideal para viagens, pescarias, acampamentos, passeios e momentos de lazer.'),
(75, 8, 'Eletrificador de Cerca para Gado', 180.00, 20, 'choque.webp', 'Eletrificador de Cerca para Gado\r\n\r\nEquipamento desenvolvido para eletrificar cercas rurais, auxiliando no manejo e contenção de animais em propriedades. Indicado para instalações de cercas elétricas destinadas a bovinos e outros animais, proporcionando praticidade e eficiência no controle do rebanho.'),
(76, 12, 'Butox', 7.00, 25, 'butox.webp', 'Butox\r\n\r\nMedicamento veterinário ectoparasiticida à base de deltametrina, indicado para o controle de parasitas externos, como carrapatos, moscas, piolhos e sarnas, conforme a apresentação e a espécie indicada pelo fabricante. Deve ser utilizado de acordo com a bula e sob orientação do médico-veterinário.'),
(77, 12, 'Newtrine', 22.00, 20, 'newtrine.jpg', 'Newtrine\r\n\r\nNewtrine é um produto veterinário utilizado no controle de parasitas, mas existem apresentações e formulações diferentes. Para eu não colocar uma indicação errada no seu catálogo, me manda uma foto da embalagem que eu confiro a composição, espécie indicada e finalidade e faço a descrição certinha.'),
(78, 12, 'K-Othrine', 18.00, 25, 'k-othrine.webp', 'K-Othrine SC 25 30mL\r\n\r\nInseticida piretroide de uso veterinário, indicado para a desinsetização de ambientes externos e controle de insetos. Produto concentrado à base de deltametrina, desenvolvido para auxiliar no controle de pragas em instalações e áreas destinadas ao manejo animal. Deve ser utilizado conforme as orientações do rótulo e da bula.'),
(79, 12, 'Regador Pequeno', 19.90, 20, 'regadorP.jpeg', 'Regador Pequeno\r\n\r\nRegador compacto e prático, ideal para cuidar de plantas, flores e vasos no dia a dia. Seu tamanho facilita o manuseio e permite uma irrigação mais controlada, sendo uma ótima opção para jardins, hortas e plantas domésticas.'),
(80, 12, 'Regador Grande', 24.90, 20, 'regadorG.jpeg', 'Regador Grande\r\n\r\nRegador de maior capacidade, ideal para facilitar a irrigação de jardins, hortas, vasos e áreas com maior quantidade de plantas. Prático para o uso diário, permite transportar e distribuir água com facilidade durante os cuidados com as plantas.'),
(81, 8, 'Mamadeira', 15.90, 30, 'mamadeira.webp', 'Mamadeira para Animais\r\n\r\nMamadeira desenvolvida para auxiliar na alimentação de filhotes, proporcionando praticidade e facilidade durante a amamentação. Ideal para cães, gatos e outros animais que necessitam de alimentação por mamadeira, conforme a necessidade do animal.'),
(82, 13, 'Molinete', 89.90, 10, 'molinete.jpeg', 'Molinete de Pesca\r\n\r\nMolinete desenvolvido para facilitar a prática da pesca, oferecendo praticidade no lançamento e recolhimento da linha. Possui sistema de carretel e manivela que proporcionam maior controle durante a pescaria, sendo uma opção para diferentes modalidades e momentos de lazer.'),
(83, 13, 'Carretilha', 99.90, 10, 'carretilha.jpeg', 'Carretilha de Pesca\r\n\r\nCarretilha desenvolvida para proporcionar maior precisão e controle durante os arremessos e o recolhimento da linha. Prática e versátil, é uma ótima opção para pescadores que buscam mais controle e desempenho durante a pescaria.'),
(84, 12, 'Mudas', 0.25, 500, 'mudas.jpeg', 'Mudas de Hortaliças\r\n\r\nMudas de hortaliças selecionadas para cultivo em hortas, vasos e canteiros. Ideais para o plantio de variedades como alface, couve, rúcula, entre outras, proporcionando praticidade para iniciar ou ampliar sua horta e cultivar alimentos frescos em casa.'),
(85, 9, 'Ração de Coelho', 6.00, 20, 'racao.coelho.jpeg', 'Ração para Coelhos\r\n\r\nAlimento desenvolvido para atender às necessidades nutricionais dos coelhos, fornecendo nutrientes essenciais para uma alimentação equilibrada. Auxilia na manutenção da saúde, crescimento e bem-estar dos animais, sendo adequada para complementar a alimentação diária conforme as orientações do fabricante.'),
(88, 11, 'Bota Ultraleve EVA', 99.00, 20, 'bota-ultraleve.png', 'Bota Ultraleve EVA\r\n\r\nBota confeccionada em EVA, material leve, resistente e de fácil limpeza. Proporciona praticidade e conforto durante o uso, sendo indicada para atividades rurais, jardinagem, trabalho e outras situações que exigem proteção e facilidade de movimentação.'),
(89, 11, 'Bota de Borracha Náutica', 86.00, 20, 'Pvc-Náutica.png', 'Bota de Borracha Náutica\r\n\r\nBota confeccionada em borracha, desenvolvida para proporcionar proteção e conforto em ambientes úmidos e atividades que exigem resistência à água. Ideal para uso em pescarias, atividades náuticas, trabalhos rurais e outras situações que necessitam de maior proteção para os pés.'),
(90, 14, 'Foice sem cabo', 40.00, 15, 'foice.jpg', 'Foice sem Cabo\r\n\r\nFerramenta agrícola com lâmina metálica resistente, desenvolvida para trabalhos de corte e manejo de vegetação. É fornecida sem cabo, permitindo a instalação de um cabo compatível conforme a necessidade do usuário.'),
(91, 14, 'Corta Vergalhão', 90.00, 10, 'corta.vergalhao.jpg', 'Corta Vergalhão\r\n\r\nFerramenta manual desenvolvida para realizar cortes em vergalhões, barras e outros materiais metálicos. Possui estrutura resistente e alças que proporcionam firmeza durante o manuseio, sendo indicada para trabalhos de construção, manutenção e atividades que exigem cortes precisos de materiais metálicos.'),
(92, 14, 'Cavadeira reta Completa', 130.00, 10, 'cavadeira.completa.png', 'Cavadeira Reta Completa\r\n\r\nFerramenta agrícola desenvolvida para cavar, abrir e preparar o solo em diferentes tipos de trabalhos. Acompanha cabo, oferecendo praticidade e firmeza durante o manuseio, sendo indicada para jardinagem, agricultura, construção e serviços gerais.'),
(93, 14, 'Serra', 20.00, 15, 'serra.jpg', 'Serra\r\n\r\nFerramenta de corte desenvolvida para realizar cortes em madeira e outros materiais, conforme o tipo de lâmina. Prática e resistente, é indicada para trabalhos de jardinagem, manutenção, marcenaria e atividades gerais que necessitam de cortes manuais.'),
(94, 14, 'Enxada Completa', 75.00, 15, 'enxada.completa.jpg', 'Enxada Completa\r\n\r\nFerramenta agrícola desenvolvida para preparar, revolver e capinar o solo, facilitando trabalhos em hortas, jardins, canteiros e áreas rurais. Acompanha cabo, proporcionando praticidade, firmeza e melhor controle durante o uso.'),
(95, 14, 'Enxada 2 caras', 85.00, 20, 'enxada-2caras.jpg', 'Enxada 2 Caras\r\n\r\nFerramenta agrícola versátil, desenvolvida para trabalhos de preparo, revolvimento e manejo do solo. Possui duas faces de corte, proporcionando maior praticidade e aproveitamento durante atividades em hortas, jardins, canteiros e áreas rurais.'),
(96, 15, 'Chapéu Vaqueiro', 59.90, 15, 'chapeu.vaqueiro.jpeg', 'Chapéu Vaqueiro\r\n\r\nChapéu estilo vaqueiro, desenvolvido para proporcionar proteção e conforto durante atividades ao ar livre. Ideal para uso em propriedades rurais, cavalgadas, eventos e momentos de lazer, combinando praticidade com o tradicional estilo country.'),
(97, 15, 'Chapéu', 39.90, 20, 'chapeu.jpeg', 'Chapéu\r\n\r\nChapéu desenvolvido para proporcionar proteção e conforto durante atividades ao ar livre. Ideal para uso no dia a dia, em propriedades rurais, passeios, trabalhos externos e momentos de lazer, oferecendo praticidade e proteção contra o sol.'),
(98, 11, 'Botina Baspan Agronobuck', 175.00, 15, 'Agro-nobuck.png', 'Botina Baspan Agronobuck\r\n\r\nBotina desenvolvida para proporcionar conforto, resistência e praticidade durante o uso. Indicada para atividades rurais, trabalhos no campo e serviços gerais, oferecendo proteção e firmeza para o dia a dia.'),
(99, 14, 'Facão Tramontina', 34.00, 20, 'facao.jpeg', 'Facão Tramontina\r\n\r\nFacão Tramontina desenvolvido para trabalhos de corte e manejo de vegetação, oferecendo resistência e praticidade durante o uso. Indicado para atividades rurais, jardinagem, limpeza de terrenos e serviços gerais que exigem uma ferramenta de corte robusta.'),
(100, 11, 'Luvas de Proteção', 4.00, 40, 'luva.webp', 'Luvas de Proteção\r\n\r\nLuvas desenvolvidas para proteger as mãos durante diferentes atividades de trabalho e serviços gerais. Proporcionam maior segurança, conforto e firmeza no manuseio de ferramentas e materiais, sendo indicadas para uso rural, jardinagem, manutenção e outras tarefas do dia a dia.'),
(101, 14, 'Mini Martelo', 30.00, 20, 'martelo.jpeg', 'Mini Martelo\r\n\r\nFerramenta compacta e prática, ideal para pequenos trabalhos de manutenção, montagem e ajustes. Seu tamanho facilita o manuseio e proporciona maior controle durante o uso, sendo uma opção útil para tarefas do dia a dia.'),
(102, 14, 'Machado', 69.90, 10, 'machado.jpeg', 'Machado\r\n\r\nFerramenta desenvolvida para trabalhos de corte e manejo de madeira, galhos e vegetação. Possui estrutura resistente e é indicada para atividades rurais, limpeza de terrenos, jardinagem e serviços gerais que exigem uma ferramenta de corte robusta.'),
(103, 15, 'Boné', 29.90, 30, 'bone.jpeg', 'Boné\r\n\r\nBoné desenvolvido para proporcionar conforto e proteção durante o dia a dia. Ideal para atividades ao ar livre, trabalhos rurais, passeios e momentos de lazer, ajudando a proteger contra a exposição ao sol.'),
(104, 15, 'Chapéu Malandrim', 49.90, 15, 'chapeumalandrin.jpeg', 'Chapéu Malandrim\r\n\r\nChapéu de estilo tradicional, desenvolvido para proporcionar conforto e proteção durante o uso. Ideal para atividades ao ar livre, trabalhos rurais, passeios e momentos de lazer, combinando praticidade com um visual característico.'),
(105, 8, 'Concentrado Suíno Integrada CS2', 80.00, 25, 'cs2.png', 'Concentrado Suíno Integrada\r\n\r\nConcentrado para alimentação de suínos, desenvolvido para complementar a dieta dos animais com nutrientes essenciais. Auxilia no crescimento, desenvolvimento e desempenho do rebanho, proporcionando uma alimentação mais equilibrada conforme a fase de criação e as orientações do fabricante.'),
(106, 8, 'Concentrado Postura Integrada CP41', 80.00, 25, 'CP41.png', 'Concentrado Postura Integrada CP41\r\n\r\nConcentrado desenvolvido para galinhas poedeiras, formulado para complementar a alimentação e fornecer nutrientes importantes para a produção de ovos. Auxilia na manutenção do desempenho, saúde e qualidade da produção, conforme a fase de criação e as orientações do fabricante.'),
(107, 8, 'Concentrado Frango Integrada CF2', 85.00, 25, 'CF2.png', '**Concentrado Frango Integrada CF2**\r\n\r\nConcentrado desenvolvido para a alimentação de **frangos**, fornecendo nutrientes essenciais para complementar a dieta e atender às necessidades nutricionais durante a criação. Auxilia no crescimento, desenvolvimento e desempenho das aves, conforme a fase de criação e as orientações do fabricante.\r\n'),
(108, 13, 'Porta Espeto', 160.00, 20, 'porta.espeto.jpeg', '**Porta Espeto**\r\n\r\nAcessório desenvolvido para organizar e armazenar espetos de churrasco de forma prática e segura. Facilita o transporte e mantém os espetos reunidos e protegidos, sendo ideal para churrascos em casa, sítios, acampamentos e momentos de lazer.\r\n'),
(109, 8, 'Ração para Codornas', 30.00, 30, 'codornas.jpg', '**Ração para Codornas**\r\n\r\nAlimento desenvolvido para atender às necessidades nutricionais das codornas, fornecendo nutrientes essenciais para uma alimentação equilibrada. Auxilia no crescimento, desenvolvimento, manutenção da saúde e desempenho das aves, conforme a fase de criação e as orientações do fabricante.\r\n'),
(110, 8, 'Suprasal Equinos', 95.00, 20, 'suprasal.jpg', 'Suprasal Equinos\r\n\r\nSuplemento mineral desenvolvido para complementar a alimentação de equinos, fornecendo minerais essenciais para auxiliar na manutenção da saúde, desenvolvimento e desempenho dos animais. Indicado para complementar a dieta conforme as necessidades nutricionais e as orientações do fabricante.'),
(111, 8, 'Ração para Equinos Paddock', 112.00, 15, 'paddock.webp', '**Ração para Equinos Paddock**\r\n\r\nAlimento desenvolvido para complementar a alimentação de equinos, fornecendo nutrientes essenciais para auxiliar na manutenção da saúde, condição corporal e desempenho dos animais. Indicada para complementar a dieta diária conforme a fase e as necessidades nutricionais do animal.\r\n'),
(112, 8, 'Ração Impulso Pré-Inicial', 100.00, 15, 'impulso.insumo.webp', 'Ração Impulso Pré-Inicial\r\n\r\nRação desenvolvida para a alimentação de leitões na fase pré-inicial, fornecendo nutrientes essenciais para atender às necessidades dessa etapa de desenvolvimento. Auxilia no crescimento, desenvolvimento e adaptação alimentar dos animais, contribuindo para um bom desempenho na fase inicial da criação.'),
(113, 8, 'Ração para Peixes Fishmix 25kg', 80.00, 20, 'Fishmix.png', '**Ração para Peixes Fishmix 25kg**\r\n\r\nRação desenvolvida para a alimentação de peixes, fornecendo nutrientes essenciais para auxiliar no crescimento, desenvolvimento e manutenção da saúde dos animais. Indicada para complementar a alimentação durante a criação, conforme a espécie e as orientações do fabricante.\r\n'),
(114, 8, 'Hypermix Leite', 140.00, 15, 'Hypermix.leite.png', '**Hypermix Leite**\r\n\r\nSuplemento desenvolvido para complementar a alimentação de **bovinos leiteiros**, fornecendo nutrientes importantes para auxiliar na manutenção da saúde, condição corporal e desempenho dos animais. Indicado para complementar a dieta do rebanho conforme a fase de produção e as orientações do fabricante.\r\n'),
(115, 8, 'Hypermix Energético ', 85.00, 15, 'HYPERMIX.png', NULL),
(116, 8, 'Benefit', 15.00, 25, 'benefit.jpg', 'Benefit Alffa 450g\r\n\r\nSuplemento para equinos, desenvolvido para complementar a alimentação e fornecer nutrientes importantes para a saúde e o desempenho dos animais. Auxilia no condicionamento, manutenção da musculatura e recuperação, sendo indicado como complemento da dieta conforme as necessidades do animal e as orientações do fabricante.'),
(117, 9, 'Deo Colônia Pet', 25.00, 20, 'deocolonia.webp', '**Deo Colônia Pet**\r\n\r\nColônia desenvolvida para deixar os pets com um **aroma agradável e refrescante** após o banho ou durante a rotina de cuidados. Ideal para cães e gatos, ajudando a manter uma sensação de limpeza e um perfume agradável no pelo.\r\n'),
(118, 9, 'Biscoito Ultralife', 18.00, 30, 'biscoitos.png', '**Biscoito Ultralife**\r\n\r\nBiscoito desenvolvido como **petisco para cães**, ideal para oferecer como recompensa ou agrado durante o dia. Uma opção prática para complementar a rotina alimentar do pet, contribuindo também para momentos de interação e treinamento.\r\n'),
(119, 8, 'Kronus 10kg', 205.00, 15, 'kronus10kg.webp', 'Kronus 10kg\r\n\r\nSuplemento mineral orgânico desenvolvido para equinos, indicado para complementar a alimentação e fornecer minerais essenciais em diferentes fases do desenvolvimento. Contribui para o equilíbrio nutricional, manutenção da saúde e bom desempenho dos animais.'),
(120, 15, 'Camisa Térmica', 80.00, 20, '2.jpeg', 'Camisa Térmica\r\n\r\nCamisa térmica desenvolvida para proporcionar conforto e proteção térmica durante atividades ao ar livre. Ajuda a manter a temperatura corporal e pode ser utilizada em trabalhos rurais, pescarias, atividades esportivas e no dia a dia.'),
(121, 15, 'Botina Feminina Rosa Café', 175.00, 15, 'botina.fem.jpeg', '**Botina Feminina Rosa Café**\r\n\r\nBotina feminina desenvolvida para proporcionar conforto, resistência e praticidade durante o uso. Com estilo moderno e acabamento na cor rosa café, é uma ótima opção para atividades rurais, trabalhos no campo e uso no dia a dia.\r\n'),
(123, 10, 'A.D.E Pó 1kg', 38.00, 0, 'A.D.E po.webp', '**A.D.E Pó 1kg**\r\nSuplemento vitamínico em pó, rico em vitaminas A, D e E, indicado para reforçar a nutrição de animais de produção e de estimação. Contribui para o fortalecimento do sistema imunológico, saúde óssea e reprodutiva, sendo de fácil administração na ração ou água.'),
(124, 10, 'CEF 50', 85.00, 0, 'CEF50.jpg', '**CEF 50**\r\n\r\nMedicamento veterinário antimicrobiano injetável à base de **cloridrato de ceftiofur 50 mg/mL**. É indicado para **bovinos e suínos** no tratamento de infecções bacterianas, incluindo problemas respiratórios, gastrointestinais, geniturinários e pododermatites, conforme a indicação do fabricante. Deve ser utilizado sob orientação do médico-veterinário.'),
(125, 10, 'Chemitril Inj Pet', 30.00, 0, 'Chemitril-Inj-pet.png', NULL),
(126, 10, 'Doxifin Tabs', 35.00, 0, 'Doxifin-Tabs.webp', NULL),
(127, 10, 'E.C.P', 37.00, 0, 'E.C.P.webp', NULL),
(128, 10, 'Hemolitan', 54.00, 0, 'Hemolitan.webp', NULL),
(129, 10, 'Ocitocina Biofarm', 17.00, 0, 'OCITOCINA-BIOFARM.png', NULL),
(130, 10, 'Otodermin', 58.00, 0, 'Otodermin.webp', NULL),
(131, 10, 'Purgante', 20.00, 0, 'PURGANTE.png', NULL),
(132, 10, 'Symbioplex', 99.00, 0, 'Symbioplex.jpg', NULL),
(133, 10, 'Top Dog 10kg', 19.00, 0, 'TopDog-10kg.webp', NULL),
(134, 10, 'Top Dog 30kg', 42.00, 0, 'TopDog30kg.webp', NULL),
(135, 10, 'Acuramax', 84.00, 0, 'acuramax.png', '**Acura Max**\r\nAntimicrobiano de uso veterinário pronto para uso, associado a um anti-inflamatório, indicado para bovinos, equinos e caninos. Frasco com 25mL, proporciona ação combinada no combate a infecções e no controle do processo inflamatório.'),
(136, 10, 'Aerocid Mata Bicheiras', 22.00, 0, 'aerocid.webp', '**Aerocid Mata Bicheiras**\r\nAerossol de ação rápida indicado para o tratamento e prevenção de bicheiras em animais. Auxilia na eliminação das larvas e na cicatrização de feridas, sendo de fácil aplicação diretamente no local afetado.'),
(137, 10, 'Agroplus', 115.00, 0, 'agroplus.webp', NULL),
(138, 10, 'Apoquel', 30.00, 0, 'apoquel.jpg', NULL),
(139, 10, 'Azium', 32.00, 0, 'azium.png', NULL),
(140, 10, 'Benxocreol', 37.00, 0, 'benxocreol.png', NULL),
(141, 10, 'Bioxan', 40.00, 0, 'bioxan.webp', NULL),
(142, 10, 'Borgal', 42.00, 0, 'borgal.webp', NULL),
(143, 10, 'Buscofin', 90.00, 0, 'buscofin.png', NULL),
(144, 10, 'Butox', 7.00, 0, 'butox.webp', NULL),
(145, 10, 'Calcioral', 25.00, 0, 'calcioral.webp', NULL),
(146, 10, 'Calfon', 70.00, 0, 'calfon.jpg', NULL),
(147, 10, 'Calminex pomada', 26.00, 0, 'calminex.webp', NULL),
(148, 10, 'Canex', 4.00, 0, 'canex.webp', NULL),
(149, 10, 'Cefa SID', 25.00, 0, 'cefaSID.jpg', NULL),
(150, 10, 'Cetoconazol 20ml', 92.00, 0, 'cetoconazol.jpg', NULL),
(151, 10, 'Chemital Puppy', 44.00, 0, 'chemital-puppy.jpg', NULL),
(152, 10, 'Chemitril Inj', 24.00, 0, 'chemitril-inj.jpg', NULL),
(153, 10, 'Chemitril', 35.00, 0, 'chemitril.jpg', NULL),
(154, 10, 'Cidental', 28.00, 0, 'cidental.webp', NULL),
(155, 10, 'Colosso Pour-on', 88.00, 0, 'colosso-pouron.webp', NULL),
(156, 10, 'Colosso', 12.00, 0, 'colosso.webp', NULL),
(157, 10, 'Colosso 1L', 210.00, 0, 'colosso1L.jpg', NULL),
(158, 10, 'Condrix', 235.00, 0, 'condrix.jpg', NULL),
(159, 10, 'Condroton', 226.00, 0, 'condroton.jpg', NULL),
(160, 10, 'Condroton 1000mg', 320.00, 0, 'condroton1000mg.jpg', NULL),
(161, 10, 'Cortvet', 16.00, 0, 'cortvet.png', NULL),
(162, 10, 'D-500', 40.00, 0, 'd-500.webp', NULL),
(163, 10, 'Dectomax', 52.00, 0, 'dectomax.webp', NULL),
(164, 10, 'Dexaflan', 16.00, 0, 'dexaflan.webp', NULL),
(165, 10, 'Dexaforce', 48.00, 0, 'dexaforce.webp', NULL),
(166, 10, 'Dexiun', 20.00, 0, 'dexiun.webp', NULL),
(167, 10, 'Diuzon', 59.00, 0, 'diuzon.webp', NULL),
(168, 10, 'Ectomosol', 42.00, 0, 'ectomosol.jpg', NULL),
(169, 10, 'Eloxicam Inj', 94.00, 0, 'eloxicam-inj.webp', NULL),
(170, 10, 'Eritros', 120.00, 0, 'eritros.webp', NULL),
(171, 10, 'Ferrodex', 28.00, 0, 'ferrodex.webp', NULL),
(172, 10, 'Florafarm', 32.00, 0, 'florafarm.webp', NULL),
(173, 10, 'Flumedin', 70.00, 0, 'flumedin.webp', NULL),
(174, 10, 'Flunixina', 20.00, 0, 'flunixina.webp', NULL),
(175, 10, 'Fortcam', 144.00, 0, 'fortcam.png', NULL),
(176, 10, 'Fosfosal', 128.00, 0, 'fosfosal.webp', NULL),
(177, 10, 'Ganadol', 70.00, 0, 'ganadol.jpg', NULL),
(178, 10, 'Ganaseg', 84.00, 0, 'ganaseg.webp', NULL),
(179, 10, 'Glicose vitaminada', 37.00, 0, 'glicose.jpg', NULL),
(180, 10, 'Hemolitan Pet', 54.00, 0, 'hemolitan.jpg', NULL),
(181, 10, 'Ibatrin', 44.00, 0, 'ibatrin.jpg', NULL),
(182, 10, 'Ideal Protein', 190.00, 0, 'ideal-protein.jpg', NULL),
(183, 10, 'Lepecd', 19.00, 0, 'lepecd.png', NULL),
(184, 10, 'Mastizone Lactação', 8.00, 0, 'mastizone-lactacao.webp', NULL),
(185, 10, 'Mastizone VS', 12.00, 0, 'mastizone-vs.png', NULL),
(186, 10, 'Mata Bicheiras SV', 20.00, 0, 'matabicheirasSV.jpg', NULL),
(187, 10, 'Monovin K', 32.00, 0, 'monovinK.png', 'Monovin K\r\n\r\nSuplemento vitamínico veterinário à base de vitamina K, indicado para auxiliar na prevenção e no tratamento de deficiências dessa vitamina nos animais. Sua utilização deve seguir as recomendações da bula e a orientação do médico-veterinário.'),
(188, 10, 'Monovin B12', 58.00, 0, 'monovinb12.png', 'Monovin B12\r\n\r\nSuplemento vitamínico veterinário à base de vitamina B12, indicado para auxiliar na prevenção e no tratamento de estados de deficiência dessa vitamina nos animais. Sua utilização deve seguir as recomendações da bula e a orientação do médico-veterinário.'),
(189, 10, 'Nutrifull cat', 85.00, 0, 'nutrifull.webp', NULL),
(190, 10, 'Ocitofort', 15.00, 0, 'ocitofort.jpg', NULL),
(191, 10, 'Otopet', 28.00, 0, 'otopet.jpg', NULL),
(192, 10, 'Pericalb12', 48.00, 0, 'pericalb12.webp', NULL),
(193, 10, 'Phenodral', 25.00, 0, 'phenodral.png', NULL),
(194, 10, 'Prediderm', 40.00, 0, 'prediderm.webp', NULL),
(195, 10, 'Probiopet', 20.00, 0, 'probiopet.jpg', NULL),
(196, 10, 'Proverme', 10.00, 0, 'proverme.webp', NULL),
(198, 10, 'Revolution plus 0,25', 76.00, 0, 'revoltion0,25.jpg', NULL),
(199, 10, 'Revolution plus 0,50', 80.00, 0, 'revolution-0,50.webp', NULL),
(200, 10, 'Revolution 0,75', 80.00, 0, 'revolution0,75.webp', NULL),
(201, 10, 'Revolution plus 1', 84.00, 0, 'revolution1.webp', NULL),
(202, 10, 'Ripercol oral', 128.00, 0, 'ripercol-solucao.webp', NULL),
(203, 10, 'Ripercol injetavel', 18.00, 0, 'ripercol.webp', NULL),
(204, 10, 'Ripercol  injetável 250', 90.00, 0, 'ripercol250.webp', NULL),
(205, 10, 'Roboforte', 275.00, 0, 'roboforte.jpg', NULL),
(206, 10, 'Rubralan', 40.00, 0, 'rubralan.webp', NULL),
(207, 10, 'Ruminol', 40.00, 0, 'ruminol.webp', NULL),
(208, 10, 'Sarcolin', 42.00, 0, 'sarcolin.jpg', NULL),
(209, 10, 'Silmox', 70.00, 0, 'silmox.webp', NULL),
(210, 10, 'Simparic 80mg', 109.20, 0, 'simparic 80.webp', NULL),
(211, 10, 'Soro Antiofídico', 142.00, 0, 'soro-antiofidico.jpg', NULL),
(212, 10, 'Sorovita', 40.00, 0, 'sorovita.png', NULL),
(213, 10, 'Sulfaprim', 67.00, 0, 'sulfaprim.jpg', NULL),
(214, 10, 'Terramicina Inj', 40.00, 0, 'terramicina-inj.webp', NULL),
(215, 10, 'Terramicina pó', 40.00, 0, 'terramicina.webp', NULL),
(216, 10, 'Top Dog 2,5kg', 10.00, 0, 'topdog-2,5.jpg', NULL),
(217, 10, 'Topline Pour On', 228.00, 0, 'topline-on.webp', NULL),
(218, 10, 'Topline spray', 42.00, 0, 'topline.webp', NULL),
(219, 10, 'Tossicanis', 64.00, 0, 'tossicanis.jpg', NULL),
(220, 10, 'Trigental', 34.00, 0, 'trigental.jpg', NULL),
(221, 10, 'simparic Trio 1,25-2,5', 77.00, 0, 'trio 1,25- 2,5.webp', NULL),
(222, 10, 'Simparic Trio 10-20kg', 115.50, 0, 'trio 10-20.webp', '**Simparica Trio 10-20kg**\r\nComprimido mastigável de ação tripla para cães, indicado para animais entre 10 e 20 kg. Proporciona proteção contra pulgas, carrapatos e vermes do coração, além de auxiliar no combate a alguns tipos de vermes intestinais. Praticidade em dose única mensal, com sabor palatável que facilita a administração.'),
(223, 10, 'Simparic Trio 2,5-5kg', 101.50, 0, 'trio 2,6 - 5.webp', '**Simparica Trio 2,5-5kg**\r\nComprimido mastigável de ação tripla para cães, indicado para animais entre 10 e 20 kg. Proporciona proteção contra pulgas, carrapatos e vermes do coração, além de auxiliar no combate a alguns tipos de vermes intestinais. Praticidade em dose única mensal, com sabor palatável que facilita a administração.'),
(224, 10, 'Simparic Trio 40-60', 129.50, 0, 'trio 40-60.webp', '**Simparica Trio 40-60kg**\r\nComprimido mastigável de ação tripla para cães, indicado para animais entre 10 e 20 kg. Proporciona proteção contra pulgas, carrapatos e vermes do coração, além de auxiliar no combate a alguns tipos de vermes intestinais. Praticidade em dose única mensal, com sabor palatável que facilita a administração.'),
(225, 10, 'Simparic Trio 5-10kg', 108.50, 0, 'trio 5-10.webp', '**Simparica Trio 5-10kg**\r\nComprimido mastigável de ação tripla para cães, indicado para animais entre 10 e 20 kg. Proporciona proteção contra pulgas, carrapatos e vermes do coração, além de auxiliar no combate a alguns tipos de vermes intestinais. Praticidade em dose única mensal, com sabor palatável que facilita a administração.'),
(226, 10, 'Trissulfin pó', 22.00, 0, 'trissulfin.png', NULL),
(227, 10, 'V-Cort', 30.00, 0, 'v-cort.webp', NULL),
(228, 10, 'Vallecalcio', 56.00, 0, 'vallecalcio.jpg', NULL),
(229, 10, 'Vermicanis 5kg', 5.00, 0, 'vermicanis5.jpg', NULL),
(230, 10, 'Vermicanis 10kg', 10.00, 0, 'vermicanis10.jpg', NULL),
(231, 10, 'Vermicanis 30kg', 25.00, 0, 'vermicanis30.jpg', NULL),
(232, 10, 'Verrudel', 30.00, 0, 'verrudel_.webp', NULL),
(233, 10, 'Vetmax Oral', 85.00, 0, 'vetmax-oral.jpg', NULL),
(234, 10, 'Vetmax', 16.00, 0, 'vetmax.webp', NULL),
(235, 10, 'Vetol Oral', 15.00, 0, 'vetol-oral.webp', NULL),
(236, 10, 'Vit ADE', 22.00, 0, 'vit-ade.webp', NULL),
(237, 13, 'Erva Black Menta Boldo', 25.00, 0, 'black-menta-boldo.png', NULL),
(238, 13, 'Erva Black Menta Black', 25.00, 0, 'black-menta-black.png', NULL),
(239, 13, 'Erva Black Menta Limão', 25.00, 0, 'black-menta-limao.png', NULL),
(240, 13, 'Erva Black Menta Limão R', 25.00, 0, 'black-menteLimao.png', NULL),
(241, 13, 'Erva Black Pura Folha', 25.00, 0, 'black-puraFolha.png', NULL),
(242, 13, 'Erva Black Lemon', 25.00, 0, 'black-lemon.png', NULL),
(243, 13, 'Erva Black Limão Caipira', 25.00, 0, 'black-limaoC.png', NULL),
(244, 13, 'Erva Black Cereja Ice', 25.00, 0, 'black-cereja-ice.png', NULL),
(245, 13, 'Erva Black Cereja', 25.00, 0, 'blacl-cereja.png', NULL),
(246, 13, 'Erva Black Abacaxi', 25.00, 0, 'black-abacaxi.png', NULL),
(247, 13, 'Erva Black Burrito', 25.00, 0, 'black-burrito.png', NULL),
(248, 13, 'Erva Black Energético', 25.00, 0, 'black-energético.png', NULL),
(249, 13, 'Erva Black Menta Paraguaia', 25.00, 0, 'black-Mparaguaia.png', NULL),
(250, 13, 'Erva Trots Tradicional', 25.00, 0, 'trots-tradicional.png', NULL),
(251, 13, 'Erva Trots Pura Folha', 25.00, 0, 'trots-purafolha.png', NULL),
(252, 13, 'Erva Trots Menta Boldo', 25.00, 0, 'trots-mentaBoldo.png', NULL),
(253, 13, 'Erva Trots Menta L', 25.00, 0, 'trots-mentaL.png', NULL),
(254, 13, 'Erva Trots Menta Strong', 25.00, 0, 'trots-mentaStrong.png', NULL),
(255, 13, 'Erva Trots Hortela', 25.00, 0, 'trots-hortela.png', NULL),
(256, 13, 'Erva Trots Eucalipto', 25.00, 0, 'trots-eucalipto.png', NULL),
(257, 13, 'Erva Trots Especiarias', 25.00, 0, 'trots-especiarias.png', NULL),
(258, 13, 'Erva Trots Cereja', 25.00, 0, 'trots-cereja.png', NULL),
(259, 13, 'Erva Trots Burrito', 25.00, 0, 'trots-burrito.png', NULL),
(260, 13, 'Erva Trots Limão Caipira', 25.00, 0, 'trots-limaoC.png', NULL),
(261, 13, 'Erva Trots Limão C', 25.00, 0, 'trots-LC.png', NULL),
(262, 13, 'Erva Trots Menta Boldo 2', 25.00, 0, 'trots-MB.png', NULL),
(263, 13, 'Erva Trots Menta L 2', 25.00, 0, 'trots-ML.png', NULL),
(264, 13, 'Erva Chacal Menta', 25.00, 0, 'chacal-menta.png', NULL),
(265, 13, 'Erva Chacal Menta Boldo', 25.00, 0, 'chacal-mentaBoldo.png', NULL),
(266, 13, 'Erva Chacal Menta Forte', 25.00, 0, 'chacal-mentaForte.png', NULL),
(267, 13, 'Erva Chacal Menta LR', 25.00, 0, 'chacal-mentaLR.png', NULL),
(268, 13, 'Erva Chacal ML', 25.00, 0, 'chacal-ML.png', NULL),
(269, 13, 'Erva Chacal M Extreme', 25.00, 0, 'chacal-Mextreme.png', NULL),
(270, 13, 'Erva Chacal Pura Folha', 25.00, 0, 'chacal-pf.png', NULL),
(271, 13, 'Erva Chacal Limão', 25.00, 0, 'chacal-limao.png', NULL),
(272, 13, 'Erva Chacal Limão R', 25.00, 0, 'chacal-limaoR.png', NULL),
(273, 13, 'Erva Chacal Cereja', 25.00, 0, 'chacal-cereja.png', NULL),
(274, 13, 'Erva Chacal Burrito', 25.00, 0, 'chacal-burrito.png', NULL),
(275, 13, 'Erva Chacal Energético', 25.00, 0, 'chacal-energetico.png', NULL),
(276, 13, 'Erva Chacal Uva', 25.00, 0, 'chacal-uva.png', NULL),
(277, 13, 'Erva Chacal Tangerina', 25.00, 0, 'chacal-tangerina.png', NULL),
(278, 13, 'Erva Chacal Secret', 25.00, 0, 'chacal-secret.png', NULL),
(279, 13, 'Erva Celeiros Tradicional', 25.00, 0, 'Celeiros_Tradicional.png', NULL),
(280, 13, 'Erva Celeiros Pura Folha', 25.00, 0, 'Celeiros_PuraFolha.png', NULL),
(281, 13, 'Erva Celeiros Chimarrão', 25.00, 0, 'Celeiros_Chimarrao.png', NULL),
(282, 13, 'Erva Celeiros Boldo Menta', 25.00, 0, 'Celeiros_BoldoMenta.png', NULL),
(283, 13, 'Erva Celeiros Burrito', 25.00, 0, 'Celeiros_Burrito.png', NULL),
(284, 13, 'Erva Celeiros Cereja', 25.00, 0, 'Celeiros_Cereja.png', NULL),
(285, 13, 'Erva Celeiros Detox', 25.00, 0, 'Celeiros_Detox.png', NULL),
(286, 13, 'Erva Celeiros Limão', 25.00, 0, 'Celeiros_Limao.png', NULL),
(287, 13, 'Erva Celeiros Menta Limão', 25.00, 0, 'Celeiros_MentaLimao.png', NULL),
(288, 13, 'Kit Trot\'s Sertanejos do Brasil', 85.00, 0, 'sertanejos.png', NULL),
(289, 13, 'Erva Turvo Pura Folha', 18.00, 0, 'erva-turvo-PF.webp', NULL),
(290, 13, 'Erva Turvo Menta Boldo', 18.00, 0, 'turvo-mentaBoldo.webp', NULL),
(291, 13, 'Erva Turvo Menta Fort', 18.00, 0, 'turvo-mentaFort.webp', NULL),
(292, 13, 'Erva Turvo Burrito', 18.00, 0, 'turvo-burrito.webp', NULL),
(293, 9, 'Ração Special Dog Carne Plus', 12.00, 0, 's.d-carne-plus.png', NULL),
(294, 9, 'Ração Special Dog Vegetais', 12.50, 0, 's.d-vegetais.png', NULL),
(295, 9, 'Ração Special Dog Light RMG', 194.90, 0, 's.d-light-RMG.png', NULL),
(296, 9, 'Ração Special Dog Light', 15.00, 0, 's.d-light.png', NULL),
(297, 9, 'Ração Special Dog Gold', 13.00, 0, 's.d-gold.png', NULL),
(298, 9, 'Ração Special Dog Gold JR', 252.00, 0, 's.d-gold-JR.png', NULL),
(299, 9, 'Ração Special Dog Ultralife RP Cordeiro', 14.00, 0, 's.d-ultralife-RP-cordeiro.png', NULL),
(300, 9, 'Ração Special Dog Ultralife RMG', 234.90, 0, 's.d-ultralife-RMG.png', NULL),
(301, 9, 'Ração Special Dog Ultralife JR', 189.90, 0, 's.d-ultralife-JR.png', NULL),
(302, 9, 'Ração Special Dog Senior Ultralife', 194.90, 0, 's.d-senior-ultralife.png', NULL),
(303, 9, 'Ração Special Dog JR RMG', 182.90, 0, 's.d-JR-RMG.png', NULL),
(304, 9, 'Ração Special Cat Castrado', 18.50, 0, 's.c-castrado.png', NULL),
(305, 9, 'Ração Special Cat Castrado +10', 344.90, 0, 's.c-castrado+10.png', NULL),
(306, 9, 'Ração Special Cat Ultralife Castrado', 309.90, 0, 's.c-ultralife-castrado.png', NULL),
(307, 9, 'Ração Special Cat Ultralife Castrado Salmão', 314.90, 0, 's.c-ultralife-castrado-salmao.png', NULL),
(308, 9, 'Ração Special Cat Ultralife Filhote', 18.50, 0, 's.c-ultralife-filhote.png', NULL),
(309, 9, 'Ração Special Cat Bionatural Filhote', 76.90, 0, 's.c-bionatural-filhote.png', NULL),
(310, 9, 'Ração Bionatural AD RMG', 20.00, 0, 'bionatural-AD-RMG.png', NULL),
(311, 9, 'Ração Bionatural AD RP', 20.00, 0, 'bionatural-AD-RP.png', NULL),
(312, 9, 'Ração Bionatural JR RMG', 20.00, 0, 'bionatural-JR-RMG.png', NULL),
(313, 9, 'Ração  Special Dog Bionatural Júnior RP', 20.00, 0, 'bionatural-JR-RP.png', NULL),
(314, 9, 'Ração Special Dog Bionatural Adulto RP Cordeiro', 20.00, 0, 'bionatural-RP-cordeiro.png', NULL),
(315, 9, 'Ração Special Cat Bionatural Castrado', 20.00, 0, 'bionatural-castrado.png', NULL),
(316, 9, 'Ração Special Dog Bionatural Light', 30.00, 0, 'bionatural-light.png', NULL),
(317, 9, 'Ração Special Dog Bionatural Senior', 20.00, 0, 'bionatural-senior.png', NULL);
INSERT INTO `produto` (`id`, `id_categoria`, `nome`, `preço`, `estoque`, `imagem`, `descricao`) VALUES
(318, 9, 'Ração Bionatural Sensitive RP', 30.00, 0, 'bionatural-sensitiveRP.png', NULL),
(319, 9, 'Areia Bionature', 30.00, 0, 'bionature.png', NULL),
(320, 9, 'Ração Premier Adulto', 26.00, 0, 'premier-ad.png', NULL),
(321, 9, 'Ração Premier Filhote', 28.00, 0, 'premier-filhote.webp', NULL),
(322, 9, 'Ração Premier Senior', 261.90, 0, 'premier-senior.webp', NULL),
(323, 9, 'Ração Premier Pitbull 12Kg', 276.00, 0, 'premier-pitbull.png', NULL),
(324, 9, 'Ração Premier Gastrointestinal', 81.50, 0, 'premier-gastrointestinal.webp', NULL),
(325, 9, 'Ração Friskies Carne', 20.00, 0, 'racao-fris-carne.png', NULL),
(326, 9, 'Ração Whiskas Carne', 24.00, 0, 'racao-whiskas-carne.png', NULL),
(330, 9, 'Petisco Funny Dog', 13.00, 0, 'funny-dog-carne.png', NULL),
(331, 9, 'Ração Fórmula Natural Nature Life', 299.90, 0, 'FN-life.png', NULL),
(332, 9, 'Ração Fórmula Natural Fresh Meat RMG', 380.00, 0, 'FN-freshmeat-md.webp', NULL),
(333, 9, 'Ração Special Dog júnior', 14.50, 0, 'JR-carne.png', NULL),
(334, 9, 'Ração Special Dog Junior Pequeno Porte', 14.50, 0, 'JR-pequeno-porte.png', NULL),
(335, 9, 'Ração Royal Canin Mini Indoor', 117.00, 0, 'mini-indor.png', NULL),
(336, 9, 'Ração Royal Canin Mini Indoor Puppy', 60.00, 0, 'mini-indor-pupy.png', NULL),
(337, 9, 'Ração Premier GoldeN Power Training', 173.00, 0, 'power-training.png', NULL),
(338, 9, 'Ração Super Dog', 100.00, 0, 'super-dog.webp', NULL),
(339, 9, 'Ração Royal Canin Hypoalergenic', 427.00, 0, 'hypoalergenic.png', NULL),
(340, 9, 'Ração Royal Canin Satietty', 478.00, 0, 'satietty.jpg', NULL),
(341, 9, 'Condicionador Doctor Animal', 30.00, 0, 'doctoranimal.webp', NULL),
(342, 9, 'Avitrin Reprodução', 46.00, 0, 'Avitrin-Reproducao.webp', NULL),
(343, 11, 'Botina de Segurança', 65.00, 0, 'Botina-segurança.png', NULL),
(344, 9, 'Fralda Fêmea', 32.00, 0, 'Fralda-Higienica.webp', NULL),
(345, 9, 'Limpa Dobrinhas Pet', 20.00, 0, 'Limpa-Dobrinhas.webp', NULL),
(346, 9, 'Limpa Orelhas Pet', 20.00, 0, 'Limpa-Orelhas.png', NULL),
(347, 9, 'Osso Fêmur Bovino', 42.00, 0, 'Osso-femur.jpg', NULL),
(348, 9, 'Special Dog Bifinhos', 30.00, 0, 'S.d-bifinhos.png', NULL),
(349, 12, 'SBP', 30.00, 0, 'SBP.png', NULL),
(350, 10, 'Sabonete Sarnicida Matacura', 16.00, 0, 'Sabonete-Sarnicida-Matacura.webp', NULL),
(351, 10, 'Aerosol Matacura', 35.00, 0, 'aerosol-matacura.webp', NULL),
(352, 12, 'Afasta Gatos Repelente', 30.00, 0, 'afasta-gatos.jpg', NULL),
(353, 10, 'Agimax', 50.00, 0, 'agimax.webp', NULL),
(355, 14, 'Alicate Cortador', 35.00, 0, 'alicate-cortador.webp', NULL),
(356, 9, 'Alicate Lixa de Unha Pet', 30.00, 0, 'alicate-lixa.webp', NULL),
(358, 12, 'Anti Algas', 17.00, 0, 'antialgas.jpg', NULL),
(359, 12, 'Anticloro', 20.00, 0, 'anticloro.webp', NULL),
(360, 9, 'Areia Sílica', 35.00, 0, 'areia-cílica.png', NULL),
(361, 12, 'Atratex Gel Barata', 10.00, 0, 'atratex-barataGel.webp', NULL),
(362, 12, 'Atratex Formicida Gel', 10.00, 0, 'atratex_formicida_gel.webp', NULL),
(363, 9, 'Avitrin Vitamina E', 40.00, 0, 'avitrin-E.jpg', NULL),
(364, 9, 'Avitrin Antibiótico', 36.00, 0, 'avitrin-antibiotico.webp', NULL),
(365, 9, 'Avitrin Cálcio', 30.00, 0, 'avitrin-calcio.webp', NULL),
(366, 9, 'Avitrin Canto', 32.00, 0, 'avitrin-canto.webp', NULL),
(367, 9, 'Avitrin Muda', 35.00, 0, 'avitrin-muda.jpg', NULL),
(368, 9, 'Avitrin Plumas', 34.00, 0, 'avitrin-plumas.jpg', NULL),
(369, 9, 'Avitrin PS', 32.00, 0, 'avitrin-ps.jpg', NULL),
(370, 9, 'Avitrin Vermífugo', 30.00, 0, 'avitrin-vermifugo.jpg', NULL),
(371, 9, 'Avitrin Vitamínico', 26.00, 0, 'avitrin-vitaminico.jpg', NULL),
(372, 9, 'Baby Mix', 10.00, 0, 'baby-mix.webp', NULL),
(373, 10, 'Labicon Bacter', 25.00, 0, 'bacte.webp', NULL),
(374, 8, 'Bebedouro Suíno', 75.00, 0, 'bebedouro-suino.jpg', NULL),
(377, 8, 'Beteira Plástico', 30.00, 0, 'beteira-plastico.webp', NULL),
(378, 9, 'Bico de Mamadeira', 4.00, 0, 'bico-mamadeira.webp', NULL),
(382, 9, 'Bionature', 30.00, 0, 'bionature.webp', NULL),
(383, 9, 'Biscrok Marrobone Pedigree', 22.00, 0, 'biscoito-pedigree.webp', NULL),
(385, 9, 'Biscrok 1kg', 36.00, 0, 'biscrok.webp', NULL),
(387, 9, 'Branco de Neve', 35.00, 0, 'branco-de-neve.webp', NULL),
(388, 12, 'Brudden 1,5L', 75.00, 0, 'brudden1,5.webp', NULL),
(389, 12, 'Brudden 5L', 130.00, 0, 'brudden5L.webp', NULL),
(390, 9, 'Caixa de Transporte Pet', 80.00, 0, 'caixa-transporte.webp', NULL),
(393, 9, 'Cama Simples', 25.00, 0, 'cama-simples.webp', NULL),
(394, 9, 'Caminha Pet', 0.00, 0, 'caminha.jpg', NULL),
(395, 11, 'Capa de Chuva Amarela', 38.00, 0, 'capa-chuva-amarela.webp', NULL),
(396, 11, 'Capa de Chuva', 80.00, 0, 'capa-chuva.webp', NULL),
(397, 10, 'Cetoconazol Shampoo 2% Ibasa', 56.00, 0, 'cetoconazol-ibasa.jpg', NULL),
(398, 12, 'Chacal 2,5L', 180.00, 0, 'chacal2,5L.webp', NULL),
(399, 14, 'Chave Interruptora Cerca Elétrica', 16.00, 0, 'chave-interruptora.webp', NULL),
(400, 10, 'Clorexidina Shampoo e Condicionador', 28.50, 0, 'clorexidina-shamp-cond.webp', NULL),
(401, 8, 'Ração Coelhos Algomix', 6.00, 0, 'coelhos-algomix.jpg', NULL),
(402, 9, 'Colarato Coleira Antipulgas', 8.00, 0, 'colarato.webp', NULL),
(403, 9, 'Colchonete Pet', 0.00, 0, 'colchonete.webp', NULL),
(404, 9, 'Comedouro Inox', 20.00, 0, 'comed-inox.webp', NULL),
(405, 9, 'Comedouro Pesado', 35.00, 0, 'comed-pesado.jpg', NULL),
(406, 9, 'Creme Dental Pet', 20.00, 0, 'creme-dental.webp', NULL),
(407, 9, 'Creminho Carne', 22.00, 0, 'creminho-carne.png', NULL),
(408, 9, 'Creminho Frango', 0.00, 0, 'creminho-frango.png', NULL),
(409, 9, 'Creminho Salmão', 0.00, 0, 'creminho-salmao.png', NULL),
(410, 8, 'Creolina', 17.00, 0, 'creolina.webp', NULL),
(411, 8, 'Creolina 1L', 102.00, 0, 'creolina1L.webp', NULL),
(412, 9, 'Caixa de Transporte Plastpet', 80.00, 0, 'cx-transporte-plastpet.webp', NULL),
(413, 9, 'Dentastix', 16.00, 0, 'dentastix.png', NULL),
(415, 10, 'Dermaconfort', 312.00, 0, 'dermaconfort.png', NULL),
(416, 10, 'Diclofenaco', 35.00, 0, 'diclofenaco.webp', NULL),
(418, 9, 'Dogitos Linguiça', 8.00, 0, 'dogitos-ling.jpg', NULL),
(419, 9, 'Dogitos', 0.00, 0, 'dogitos.jpg', NULL),
(420, 13, 'Erva Double Black', 25.00, 0, 'double-black.png', NULL),
(421, 9, 'Casinha Durahouse', 50.00, 0, 'durahouse.jpg', NULL),
(422, 9, 'Toalete Duracats Vermelho', 185.00, 0, 'durapet-toalete.webp', NULL),
(423, 9, 'Eliminador de Odores', 25.00, 0, 'eliminador-odores.jpg', NULL),
(424, 14, 'Fio Eletroplástico Cerca Elétrica', 105.00, 0, 'fio-eletroplastico.webp', NULL),
(425, 14, 'Fio de Nylon Roçadeira', 5.00, 0, 'fio-nylon.jpg', NULL),
(426, 9, 'Ração Fishmix Engorda 4-6mm', 94.00, 0, 'fishmix.jpg', NULL),
(427, 12, 'Fertilizante Frutíferas', 8.00, 0, 'frutiferas.webp', NULL),
(428, 13, 'Garrafa Isotérmica', 0.00, 0, 'garrafa-isotermica.webp', NULL),
(430, 10, 'Glicose 50%', 48.00, 0, 'glicose.webp', NULL),
(431, 12, 'Glifomato 10', 18.00, 0, 'glifomato10.jpg', NULL),
(432, 9, 'Golden Cookie', 22.00, 0, 'golden-cookie.webp', NULL),
(433, 9, 'Orelha Suína', 12.00, 0, 'gos-orelhab.jpg', NULL),
(434, 8, 'Grão Verde', 1.50, 0, 'graoverde.jpg', NULL),
(435, 9, 'Ração Hills', 50.00, 0, 'hills.jpg', NULL),
(436, 8, 'Hypermix', 0.00, 0, 'hypermix.webp', NULL),
(437, 12, 'Inseticon', 25.00, 0, 'inseticon.webp', NULL),
(438, 14, 'Isolador Castanha Cerca Elétrica', 1.30, 0, 'isolador-castanha.webp', NULL),
(439, 14, 'Isolador Catraca Cerca Elétrica', 16.00, 0, 'isolador-catraca.webp', NULL),
(440, 14, 'Isolador Gancho Cerca Elétrica', 2.50, 0, 'isolador-gancho.webp', NULL),
(441, 14, 'Isolador Longo Cerca Elétrica', 6.00, 0, 'isolador-longo.webp', NULL),
(442, 14, 'Isolador Manopla Cerca Elétrica', 38.00, 0, 'isolador-manopla.webp', NULL),
(443, 14, 'Isolador Vergalhão Cerca Elétrica', 1.50, 0, 'isolador-vergalhao.jpg', NULL),
(444, 13, 'Garrafa Isotérmica Soprano P', 60.00, 0, 'isotermica-sopranoP.webp', NULL),
(445, 14, 'Jimo Antisséptico Elétrico', 22.00, 0, 'jimo-antiset-eletrico.jpg', NULL),
(446, 12, 'K-Othrine', 18.00, 0, 'k-othrine.webp', NULL),
(448, 12, 'Lesmax', 8.00, 0, 'lesmax.webp', NULL),
(449, 9, 'Luva Tira Pelos Pet', 20.00, 0, 'luva-tira-pelos.webp', NULL),
(450, 10, 'Madepó', 5.00, 0, 'madePo.png', 'Madepó (1kg)\r\nInseticida em pó à base de deltametrina, indicado para jardinagem amadora e eficaz no combate a formigas urbanas e cortadeiras. Embalagem com 4 pacotes de 250g (peso líquido total de 1kg), ideal para aplicação em jardins, quintais e áreas externas.'),
(451, 10, 'Matacura Antisseborreico', 40.00, 0, 'matacura-antisseborreico.webp', NULL),
(452, 12, 'Moscaute Gel', 13.00, 0, 'moscaute-gel.jpg', NULL),
(453, 12, 'Newtrine Home', 35.00, 0, 'newtrine-home.jpg', NULL),
(454, 12, 'Newtrine Local', 35.00, 0, 'newtrine-local.webp', NULL),
(455, 11, 'Óculos de Segurança', 15.00, 0, 'oculos-seguranca.jpg', NULL),
(456, 8, 'Óleo para Ordenha', 36.00, 0, 'oleo-ordenha.jpg', NULL),
(457, 9, 'Osso Petisco Cenoura kg', 120.00, 0, 'oso-cenoura.jpg', NULL),
(458, 9, 'Osso Petisco Nó', 120.00, 0, 'osso-no.jpg', NULL),
(459, 9, 'Pá Dosadora de Ração', 27.00, 0, 'pa-medidore.jpg', NULL),
(460, 9, 'Patê Atum', 20.00, 0, 'patê-atum.png', NULL),
(462, 9, 'Patê Carne', 0.00, 0, 'patê-carne.png', NULL),
(463, 9, 'Patê Frango', 0.00, 0, 'patê-frango.png', NULL),
(464, 9, 'Ração Pequeno Porte', 94.90, 0, 'pequeno-porte.png', NULL),
(465, 9, 'Perro 7 em 1', 18.00, 0, 'perro-7em1.webp', NULL),
(466, 9, 'Shampoo Perro Pelos Claros', 18.00, 0, 'perro-PC.png', NULL),
(467, 9, 'Perro Banho a Seco', 0.00, 0, 'perro-banhoaseco.jpg', NULL),
(468, 9, 'Perro Coco', 0.00, 0, 'perro-coco.jpg', NULL),
(469, 9, 'Educador Perro Para Gatos', 35.00, 0, 'perro-ed-gatos.webp', NULL),
(470, 9, 'Perro Neutro', 18.00, 0, 'perro-neutro.jpeg', NULL),
(471, 9, 'Limpa Lágrimas Petclean', 28.00, 0, 'petclean.webp', NULL),
(472, 9, 'Pethand', 25.00, 0, 'pethand.jpg', NULL),
(473, 9, 'Petisco Fris Carne', 10.00, 0, 'petisco-fris-carne.png', NULL),
(474, 9, 'Petisco Fris Frango', 0.00, 0, 'petisco-fris-frango.png', NULL),
(475, 9, 'Petisco Fris Salmão', 0.00, 0, 'petisco-fris-salmao.png', NULL),
(476, 9, 'Petisco Whiskas Bola', 15.00, 0, 'petisco-whiskas-bola.png', NULL),
(477, 9, 'Petiscos Whiskas Controle de Pelo', 0.00, 0, 'petiscos-whiskas-pelo.png', NULL),
(478, 9, 'Pipicat Floral', 26.00, 0, 'pipicat-floral.png', NULL),
(479, 9, 'Pipicat Multi Cat', 20.00, 0, 'pipicat-multi-cat.png', NULL),
(480, 9, 'Pipicat Classica', 20.00, 0, 'pipicat.png', NULL),
(481, 12, 'Fertilizante Para Plantas', 7.00, 0, 'plantas.jpg', NULL),
(482, 9, 'Premier Cookie', 25.00, 0, 'premier-cookie.webp', NULL),
(483, 9, 'Ração PremierPet Gatos Pelos Longos', 221.90, 0, 'premierPL.webp', NULL),
(484, 8, 'Proequino', 65.00, 0, 'proequino.webp', NULL),
(485, 10, 'Promun Cat', 75.00, 0, 'promun-cat.webp', NULL),
(486, 10, 'Promun Dog', 75.00, 0, 'promundog.jpg', NULL),
(487, 9, 'Alcon Club Psita Bits', 30.00, 0, 'psita-bits.jpg', NULL),
(488, 9, 'Alcon Club Psita Mix', 45.00, 0, 'psita-mix.jpg', NULL),
(489, 9, 'Psita Sticks', 32.00, 0, 'psita-sticks.webp', NULL),
(490, 9, 'Quidog', 9.00, 0, 'quidog.webp', NULL),
(491, 8, 'Ração Algomix Bovinos Corte 18% 40kg', 100.00, 0, 'racao-algomix.jpg', NULL),
(492, 14, 'Rasqueadeira', 22.00, 0, 'rasqueadeira.jpg', NULL),
(493, 14, 'Rasqueadeira Larga', 22.00, 0, 'rasqueadeiraG.jpg', NULL),
(494, 12, 'Raticida Maki', 2.50, 0, 'raticida-maki.webp', NULL),
(495, 12, 'Raticida Citromax', 2.00, 0, 'raticidacitromax.jpg', NULL),
(496, 14, 'Ratoeira', 5.00, 0, 'ratoeira.webp', NULL),
(498, 9, 'Alcon Club Ring Neck Mix', 50.00, 0, 'ring-nec.webp', NULL),
(499, 14, 'Roldana Cerca Elétrica', 1.00, 0, 'roldana.webp', NULL),
(501, 9, 'Ração Special Cat Filhote', 18.50, 0, 's.c-filhote.jpg', NULL),
(502, 9, 'Ração Special Cat Peixe', 16.00, 0, 's.c-peixe.png', NULL),
(503, 9, 'Ração Special Dog Bifinho', 30.00, 0, 's.d-bifinho.png', NULL),
(504, 9, 'Ração Special Dog Carne', 11.00, 0, 's.d-carne.png', NULL),
(505, 9, 'Ração Special Dog Ultralife AD RP Frango', 14.00, 0, 's.d-ultralife-RP.png', NULL),
(506, 9, 'Sabonete Dugs Antiparasitário', 10.00, 0, 'sabonete-world.jpg', NULL),
(507, 9, 'Sachê Friskies Atum', 0.00, 0, 'sache-fris-atum.png', NULL),
(508, 9, 'Sachê Fris Carne', 0.00, 0, 'sache-fris-carne.png', NULL),
(509, 9, 'Sachê Fris Cordeiro', 0.00, 0, 'sache-fris-cordeiro.png', NULL),
(510, 9, 'Sachê Fris Frango', 0.00, 0, 'sache-fris-frango.png', NULL),
(511, 9, 'Sachê Fris Peixe', 0.00, 0, 'sache-fris-peixeb.png', NULL),
(512, 9, 'Sachê Fris Peru', 0.00, 0, 'sache-fris-peru.png', NULL),
(513, 9, 'Sachê Fris Salmão', 0.00, 0, 'sache-fris-salmao.png', NULL),
(514, 9, 'Sachê Golden Gourmet', 16.00, 0, 'sache-goldeN.jpg', NULL),
(515, 9, 'Sachê Pedigree', 4.00, 0, 'sache-pedigree.png', NULL),
(516, 9, 'Sachê Special Cat Carne', 0.00, 0, 'sache-s.c-carne.png', NULL),
(517, 9, 'Sachê Special Cat Castrado', 0.00, 0, 'sache-s.c-castrado.png', NULL),
(518, 9, 'Sachê Special Cat', 4.00, 0, 'sache-s.c-cordeiro.png', NULL),
(523, 9, 'Sachê Special Dog', 4.00, 0, 'sache-s.d-carne.png', NULL),
(528, 9, 'Sachê Whiskas', 0.00, 0, 'sache-whiskas-frango.png', NULL),
(529, 9, 'Bandeja higienica', 20.00, 0, 'sanitario-caes.webp', '**Bandeja Higiênica**\r\n\r\nBandeja higiênica prática e resistente, ideal para auxiliar na higiene e organização do ambiente dos pets. Fabricada com material de alta durabilidade e fácil limpeza, oferece praticidade no dia a dia e maior conforto durante o uso.\r\n'),
(530, 9, 'WC Sanitário Cat', 145.00, 0, 'sanitario-para-gatos.png', '**WC Sanitário Cat**\r\n\r\nCaixa sanitária fechada desenvolvida para proporcionar mais higiene, privacidade e conforto aos gatos durante o uso. Seu design auxilia na redução da dispersão de areia e odores, além de contar com estrutura resistente e de fácil limpeza, tornando a rotina dos tutores muito mais prática.\r\n'),
(531, 9, 'Shampoo Antiparasitário', 28.50, 0, 'shampoo-antiparasitario.webp', 'Shampoo Antiparasitário\r\n\r\nShampoo antiparasitário desenvolvido para auxiliar no combate a pulgas, carrapatos e outros ectoparasitas, promovendo uma limpeza eficiente da pele e da pelagem. Sua fórmula contribui para a higiene do animal, deixando os pelos limpos, macios e com agradável sensação de frescor.'),
(532, 9, 'Shampoo Catdog', 24.00, 0, 'shampoo-catdog.jpg', '**Shampoo CatDog Clareador 3 em 1**\r\n\r\nShampoo veterinário 3 em 1 desenvolvido para cães e gatos, promovendo limpeza, condicionamento e realce da tonalidade natural da pelagem clara. Sua fórmula de pH neutro auxilia na remoção de impurezas, deixando os pelos limpos, macios, brilhantes e com aparência renovada, sendo ideal para a higiene frequente dos pets.\r\n'),
(533, 9, 'Shampoo Clorexidina', 28.50, 0, 'shampoo-clorexidina.png', '**Shampoo Dugs Clorexidina**\r\n\r\nShampoo veterinário formulado com clorexidina, indicado para auxiliar na higiene da pele e da pelagem de cães e gatos. Sua ação promove uma limpeza profunda, contribuindo para o controle da proliferação de microrganismos e auxiliando nos cuidados dermatológicos, sempre conforme a orientação do médico-veterinário.\r\n'),
(534, 9, 'Shampoo Doctor Animal Pelos Escuros', 30.00, 0, 'shampoo-doctoranimal.webp', '**Shampoo Doctor Animal Pelos Escuros**\r\n\r\nShampoo veterinário desenvolvido especialmente para cães e gatos com pelagem escura. Sua fórmula promove uma limpeza eficiente, auxiliando na realce da tonalidade natural dos pelos, além de proporcionar maciez, brilho e uma agradável sensação de frescor, contribuindo para a higiene e o bem-estar do seu pet.\r\n'),
(535, 9, 'Shampoo Matacura Sarnicida e Antipulgas', 32.00, 0, 'shampoo-matacura.jpg', '**Shampoo Matacura Sarnicida e Antipulgas**\r\n\r\nShampoo veterinário indicado para cães, formulado para auxiliar no combate à sarna, pulgas e outros ectoparasitas, promovendo uma higiene eficiente da pele e da pelagem. Sua fórmula contribui para a limpeza, alívio do desconforto causado por parasitas e manutenção da saúde da pele, devendo ser utilizado conforme as orientações do fabricante e do médico-veterinário.\r\n'),
(536, 9, 'Shampoo para Gatos', 18.00, 0, 'shampoogatos.jpg', '**Shampoo Perro para Gatos**\r\n\r\nShampoo veterinário desenvolvido especialmente para a higiene de gatos, promovendo limpeza eficiente sem agredir a pele e a pelagem. Sua fórmula 2 em 1 limpa, condiciona e auxilia na hidratação dos pelos, proporcionando maciez, brilho e uma agradável fragrância após o banho.\r\n'),
(537, 9, 'Alcon Club Farinhada Silvestre 250g', 32.00, 0, 'silvestres.jpg', '**Alcon Club Farinhada Silvestre 250g**\r\n\r\nAlimento completo e balanceado desenvolvido especialmente para aves silvestres, formulado com ingredientes selecionados para atender às suas necessidades nutricionais. Sua composição contribui para uma alimentação saudável, auxiliando na manutenção da vitalidade, do desenvolvimento e do bem-estar das aves em todas as fases da vida.\r\n'),
(538, 12, 'Ratokill Soft Bait 200g', 32.00, 0, 'soft-bait.jpg', '**Ratokill Soft Bait 200g**\r\n\r\nRaticida em iscas macias (Soft Bait), indicado para o controle de ratos, ratazanas e camundongos em ambientes domésticos e comerciais. Sua formulação altamente atrativa facilita o consumo pelos roedores, proporcionando um controle prático e eficiente quando utilizado conforme as orientações do fabricante e as normas de segurança.\r\n'),
(540, 9, 'Máscara SOS Hidratação Pet Clean', 30.00, 0, 'sos-hidrataçaõ.webp', '**Máscara SOS Hidratação Pet Clean**\r\n\r\nMáscara de hidratação veterinária desenvolvida para cães e gatos, formulada para nutrir, fortalecer e revitalizar a pelagem. Sua composição auxilia na recuperação dos fios ressecados, promovendo maciez, brilho, hidratação profunda e facilitando o desembaraço dos pelos, deixando a pelagem saudável e bem cuidada.\r\n'),
(541, 12, 'Spanta Pombo Pastilha Insetmax', 10.00, 0, 'spanta-pombo-pastilha.webp', '**Spanta Pombo Pastilha Insetmax**\r\n\r\nPastilha desalojante desenvolvida para afastar pombos, pardais e morcegos de ambientes residenciais e comerciais. Sua formulação à base de essência de canela atua como repelente, ajudando a reduzir a permanência dessas aves e animais sem causar danos ao meio ambiente, quando utilizada conforme as orientações do fabricante.\r\n'),
(542, 12, 'Repelente Spray Aves e Morcegos', 45.00, 0, 'spanta-spray.jpg', '**Repelente Spray Aves e Morcegos**\r\n\r\nRepelente em espuma prático e eficiente, desenvolvido para afastar aves e morcegos de forma segura e sem causar danos aos animais. Formulado com ativos naturais e de uso veterinário, oferece uma aplicação simples em superfícies para evitar o pouso e a permanência indesejada, garantindo a proteção e a higiene do ambiente.'),
(543, 9, 'Spray Hálito CatDog', 20.00, 0, 'spray-halito.jpg', '**Spray Hálito CatDog**\r\n\r\nSpray higienizador bucal prático e eficiente, desenvolvido especialmente para cães e gatos. Auxilia no combate ao mau hálito e na manutenção de dentes saudáveis, proporcionando uma sensação de frescor diária e contribuindo para a higiene oral do seu pet de forma rápida e segura.'),
(544, 9, 'Spray Limpa Patas Pet Clean', 20.00, 0, 'spray-limpa-patas.png', '**Spray Limpa Patas Pet Clean**\r\n\r\nSpray higienizador de patinhas prático e eficiente, ideal para a limpeza rápida das patas de cães e gatos após passeios ou no dia a dia. Com fórmula suave e de uso veterinário, remove sujidades com facilidade, ajudando a manter a higiene do seu pet e a proteção dos ambientes da casa sem agredir a pele dos animais.'),
(545, 9, 'Spray Xô Chulé Pet Clean', 15.00, 0, 'spray-xo-chule.png', '**Spray Xô Chulé Pet Clean**\r\n\r\nSpray higienizador e neutralizador de odores prático e suave, formulado especialmente para combater o mau cheiro nas patinhas de cães e gatos. Ideal para ser utilizado após os passeios ou na rotina diária de cuidados, proporciona uma agradável sensação de limpeza e frescor sem agredir a pele sensível do seu pet.'),
(546, 9, 'Casinha Stonehouse', 0.00, 0, 'stonehouse.webp', NULL),
(547, 9, 'Casinha Stonehouse M', 0.00, 0, 'stonehouseM.webp', NULL),
(548, 12, 'Raticida Straik', 3.00, 0, 'straik.webp', '**Raticida Straik**\r\n\r\nRaticida prático e de alta eficiência, formulado para o controle e eliminação assertiva de roedores em ambientes residenciais ou comerciais. De fácil aplicação e atratividade superior, garante maior segurança e praticidade na proteção da sua casa contra pragas, mantendo os ambientes limpos e protegidos.'),
(549, 9, 'Conector Chupeta Suino', 20.00, 0, 'suporte-bebed.jpg', '**Conector para Chupeta de Suíno**\r\n\r\nConector prático e resistente fabricado em alumínio, desenvolvido especialmente para a fixação e instalação de chupetas bebedouros para suínos. Oferece alta durabilidade, encaixe firme e rosca precisa, garantindo um fluxo de água eficiente e seguro para a hidratação dos animais nas instalações.'),
(550, 12, 'Talfon Top', 6.00, 0, 'talfon-top.jpg', '**Talfon Top**\r\n\r\nInsecticida e antiparasitário em pó prático e eficiente, desenvolvido para o combate e controle de pulgas, carrapatos, piolhos e ácaros em animais e ambientes. De fácil aplicação, oferece ação rápida e proteção prolongada, auxiliando na manutenção da higiene e no bem-estar dos animais e das instalações.'),
(553, 9, 'Xixi Stop Pet Clean', 25.00, 0, 'xixi-stop.jpg', '**Xixi Stop Pet Clean**\r\n\r\nEducador sanitário em spray prático e eficiente, desenvolvido para auxiliar no adestramento de cães e gatos. Sua fórmula indica aos pets os locais onde não devem fazer suas necessidades, ajudando a proteger móveis, tapetes e ambientes da casa, mantendo a rotina de higiene organizada e livre de odores indesejados.'),
(555, 11, 'teste', 10.00, NULL, '', 'sla'),
(556, 15, 'banner', 1.00, NULL, 'banner.png', 'sla');

--
-- Acionadores `produto`
--
DELIMITER $$
CREATE TRIGGER `trg_produto_preco_positivo` BEFORE UPDATE ON `produto` FOR EACH ROW begin
	if new.preço < 0 then
	signal sqlstate '45000'
	set message_text = 'Não é permitido definir um preço negativo para o produto. ';
end if;
end
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto_variacao`
--

CREATE TABLE `produto_variacao` (
  `id_variacao` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `descricao_variacao` varchar(100) NOT NULL,
  `preco` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produto_variacao`
--

INSERT INTO `produto_variacao` (`id_variacao`, `id_produto`, `descricao_variacao`, `preco`) VALUES
(1, 338, '7kg', 38.00),
(2, 338, '25kg', 100.00);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `criado_em` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id`, `nome`, `email`, `cpf`, `telefone`, `senha`, `criado_em`) VALUES
(7, 'ian', 'ian@gmail.com', '71138703176', '61984800449', '$2b$12$o2lKavPBMSGe6DJTwQwo0.ZJ33YBpBbiwBCBAtp6Ho4zF2Myu15lu', '2026-11-02 19:15:30'),
(13, 'jubileu', 'teste@gmail.com', '52998224725', '44248625661', '$2b$12$oja5Eyyej.EBaSaDuvlz.uldEPpodA4jS5UdZ4c3wU7xIE/BGOskS', '2026-11-06 23:51:00'),
(16, 'jonas', 'teste@agrovet.com', '11144477735', '44248625661', '$2b$12$V8PUZ8UOXjqSf484nEBxYeBu435LI7V58.HjFcHkrYEseJSl63DdG', '2026-11-07 00:24:11'),
(20, 'Pedro Henrique Felippe Viturino', 'felippeviturinopedrohenrique@gmail.com', '11091108986', '44920009511', '$2b$12$0T.dNJC1JxkCfTHX27ksoe.TN1XgbZL/IrTPjU29Be53Pj7HgibzC', '2026-11-11 01:00:32'),
(23, 'Ruan Ricardo Pereira', 'Ruan@agrovet.com', '33472216301', '44336186133', '$2b$12$oM3ht3qd0EFf7wkFkW.QJOXdnDmN7Esak5UaZqAOmvFLkdko2/TTK', '2026-11-12 18:05:51');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_avaliacao_usuario` (`id_usuario`),
  ADD KEY `fk_avaliacao_produto` (`id_produto`);

--
-- Índices de tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cpf` (`cpf`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `produto`
--
ALTER TABLE `produto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=557;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD CONSTRAINT `fk_avaliacao_produto` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id`),
  ADD CONSTRAINT `fk_avaliacao_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
