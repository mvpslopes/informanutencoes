-- =============================================================================
-- Infor Manutenções — MySQL (Hostinger / phpMyAdmin)
-- Base: u179630068_infor_bd
-- Execute este script na base já criada (ou ajuste o USE abaixo).
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- Usuários do painel (Root cria usuários; Admin não cria usuários)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `site_comments`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('root','admin') NOT NULL DEFAULT 'admin',
  `full_name` varchar(128) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Root padrão: marcus.lopes — hash bcrypt fornecido (senha: *.Admin14!)
INSERT INTO `users` (`username`, `password_hash`, `role`, `full_name`) VALUES
('marcus.lopes', '$2a$12$j9s.HHxtuk2i/of141NOh.hAGdhBir8mkghEkArE018vsQASvd/Pe', 'root', 'Marcus Lopes');

-- -----------------------------------------------------------------------------
-- Produtos exibidos no site (cadastro pelo painel)
-- -----------------------------------------------------------------------------
CREATE TABLE `products` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `category` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price_display` varchar(32) NOT NULL,
  `price_decimal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `image_path` varchar(512) NOT NULL,
  `tag` varchar(64) DEFAULT NULL,
  `tag_color` varchar(32) DEFAULT NULL,
  `img_position` varchar(64) NOT NULL DEFAULT 'center center',
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_active_sort` (`is_active`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed inicial (mesmo catálogo atual do site)
INSERT INTO `products` (`category`, `name`, `description`, `price_display`, `price_decimal`, `image_path`, `tag`, `tag_color`, `img_position`, `sort_order`, `is_active`) VALUES
('Memórias RAM', 'Memória DDR4 8GB', 'Pente DDR4 8GB — instalação inclusa', 'R$ 219', 219.00,
 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=900&q=88&h=600',
 'Disponível', '#25D366', 'center 42%', 1, 1),
('SSDs', 'SSD M.2 128GB', 'SSD formato M.2 — muito mais rápido que HD', 'R$ 199', 199.00,
 '/ssd-m2.png', 'M.2', '#19A3B0', 'center 50%', 2, 1),
('SSDs', 'SSD M.2 240GB', 'SSD formato M.2 — melhor capacidade no dia a dia', 'R$ 329', 329.00,
 '/ssd-m2.png', 'M.2', '#007BFF', 'center 50%', 3, 1);

-- -----------------------------------------------------------------------------
-- Comentários / avaliações (moderação antes de aparecer no site)
-- -----------------------------------------------------------------------------
CREATE TABLE `site_comments` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `author_name` varchar(120) NOT NULL,
  `author_photo_path` varchar(512) DEFAULT NULL,
  `rating` tinyint UNSIGNED NOT NULL,
  `body` text NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `moderated_by_user_id` int UNSIGNED DEFAULT NULL,
  `moderated_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status_created` (`status`,`created_at`),
  CONSTRAINT `fk_comment_moderator` FOREIGN KEY (`moderated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- Fim do script
-- =============================================================================
