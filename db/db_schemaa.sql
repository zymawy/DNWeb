PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS `comments` (
                                          `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                          `post_id` INTEGER NOT NULL,
                                          `comment` TEXT NOT NULL,
                                          `created_at` TEXT NOT NULL,
                                          `updated_at` TEXT NOT NULL,
                                          `parent_id` INTEGER,
                                          `reader_id` INTEGER NOT NULL,
                                          `published_at` TEXT
);

CREATE INDEX IF NOT EXISTS `comments_post_id_reader_id_index` ON `comments` (`post_id`, `reader_id`);
CREATE INDEX IF NOT EXISTS `comments_post_id_id_reader_id_parent_id_index` ON `comments` (`post_id`, `id`, `reader_id`, `parent_id`);
CREATE INDEX IF NOT EXISTS `comments_post_id_index` ON `comments` (`post_id`);

CREATE TABLE IF NOT EXISTS `likes` (
                                       `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                       `reaction` VARCHAR(255),
    `type` VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS `categories` (
                                            `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                            `name` VARCHAR(255) NOT NULL,
    `created_at` TEXT NOT NULL,
    `updated_at` TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS `posts` (
                                       `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                       `user_id` INTEGER NOT NULL,
                                       `title` VARCHAR(255) NOT NULL,
    `published_at` TEXT,
    `status` VARCHAR(255) DEFAULT 'draft',
    `description` TEXT NOT NULL,
    `thumbnail` VARCHAR(255),
    `is_featured` INTEGER,
    `subtitle` VARCHAR(255),
    `created_at` TEXT NOT NULL,
    `deleted_at` TEXT,
    `modified_at` TEXT NOT NULL,
    `author_name` VARCHAR(255),
    `read_time` INTEGER
    );

CREATE INDEX IF NOT EXISTS `posts_user_id_id_index` ON `posts` (`user_id`, `id`);

CREATE TABLE IF NOT EXISTS `post_categories` (
                                                 `post_id` INTEGER NOT NULL,
                                                 `category_id` INTEGER NOT NULL,
                                                 FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    );

CREATE TABLE IF NOT EXISTS `post_tags` (
                                           `post_id` INTEGER NOT NULL,
                                           `tag_id` INTEGER NOT NULL,
                                           FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
    );

CREATE TABLE IF NOT EXISTS `users` (
                                       `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                       `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `is_admin` INTEGER NOT NULL,
    `bio` TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS `posts_likes` (
                                             `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                             `post_id` INTEGER NOT NULL,
                                             `user_id` INTEGER NOT NULL,
                                             `likes_id` INTEGER NOT NULL,
                                             FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    FOREIGN KEY (`likes_id`) REFERENCES `likes` (`id`)
    );

CREATE INDEX IF NOT EXISTS `posts_likes_post_id_user_id_index` ON `posts_likes` (`post_id`, `user_id`);
CREATE INDEX IF NOT EXISTS `posts_likes_post_id_index` ON `posts_likes` (`post_id`);
CREATE INDEX IF NOT EXISTS `posts_likes_user_id_index` ON `posts_likes` (`user_id`);

CREATE TABLE IF NOT EXISTS `tags` (
                                      `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                      `name` VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS `general_settings` (
                                                  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                                  `meta_data` JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS `seo_meta_data` (
                                               `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                               `name` VARCHAR(255) NOT NULL,
    `description` INTEGER NOT NULL,
    `post_id` INTEGER,
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
    );

CREATE INDEX IF NOT EXISTS `seo_meta_data_post_id_index` ON `seo_meta_data` (`post_id`);

CREATE TABLE IF NOT EXISTS `comments` (
                                          `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                          `post_id` INTEGER NOT NULL,
                                          `comment` TEXT NOT NULL,
                                          `created_at` TEXT NOT NULL,
                                          `updated_at` TEXT NOT NULL,
                                          `reader_id` INTEGER NOT NULL,
                                          FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`reader_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE IF NOT EXISTS `post_tags` (
                                           `post_id` INTEGER NOT NULL,
                                           `tag_id` INTEGER NOT NULL,
                                           FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
    );

CREATE TABLE IF NOT EXISTS `comments` (
                                          `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                          `post_id` INTEGER NOT NULL,
                                          `comment` TEXT NOT NULL,
                                          `created_at` TEXT NOT NULL,
                                          `updated_at` TEXT NOT NULL,
                                          `reader_id` INTEGER NOT NULL,
                                          FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`reader_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE IF NOT EXISTS `seo_meta_data` (
                                               `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                               `name` VARCHAR(255) NOT NULL,
    `description` INTEGER NOT NULL,
    `post_id` INTEGER,
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
    );

CREATE TABLE IF NOT EXISTS `post_categories` (
                                                 `post_id` INTEGER NOT NULL,
                                                 `category_id` INTEGER NOT NULL,
                                                 FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    );

CREATE TABLE IF NOT EXISTS `comments` (
                                          `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                          `post_id` INTEGER NOT NULL,
                                          `comment` TEXT NOT NULL,
                                          `created_at` TEXT NOT NULL,
                                          `updated_at` TEXT NOT NULL,
                                          `reader_id` INTEGER NOT NULL,
                                          FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`reader_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE IF NOT EXISTS `authors` (
                                         `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                         `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `born_at` TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS `general_settings` (
                                                  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                                  `meta_data` JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS `seo_meta_data` (
                                               `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                               `name` VARCHAR(255) NOT NULL,
    `description` INTEGER NOT NULL,
    `post_id` INTEGER,
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
    );

CREATE INDEX IF NOT EXISTS `seo_meta_data_post_id_index` ON `seo_meta_data` (`post_id`);

CREATE TABLE IF NOT EXISTS `post_categories` (
                                                 `post_id` INTEGER NOT NULL,
                                                 `category_id` INTEGER NOT NULL,
                                                 FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    );

CREATE TABLE IF NOT EXISTS `comments` (
                                          `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                          `post_id` INTEGER NOT NULL,
                                          `comment` TEXT NOT NULL,
                                          `created_at` TEXT NOT NULL,
                                          `updated_at` TEXT NOT NULL,
                                          `reader_id` INTEGER NOT NULL,
                                          FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`reader_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE IF NOT EXISTS `likes` (
                                       `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                       `post_id` INTEGER NOT NULL,
                                       `user_id` INTEGER NOT NULL,
                                       FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE IF NOT EXISTS `tags` (
                                      `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                      `name` VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS `authors` (
                                         `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                         `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `born_at` TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS `general_settings` (
                                                  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                                  `meta_data` JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS `seo_meta_data` (
                                               `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                               `name` VARCHAR(255) NOT NULL,
    `description` INTEGER NOT NULL,
    `post_id` INTEGER,
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
    );

CREATE INDEX IF NOT EXISTS `seo_meta_data_post_id_index` ON `seo_meta_data` (`post_id`);

CREATE TABLE IF NOT EXISTS `post_categories` (
                                                 `post_id` INTEGER NOT NULL,
                                                 `category_id` INTEGER NOT NULL,
                                                 FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    );

CREATE TABLE IF NOT EXISTS `comments` (
                                          `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                          `post_id` INTEGER NOT NULL,
                                          `comment` TEXT NOT NULL,
                                          `created_at` TEXT NOT NULL,
                                          `updated_at` TEXT NOT NULL,
                                          `reader_id` INTEGER NOT NULL,
                                          FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`reader_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE IF NOT EXISTS `posts` (
                                       `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                       `user_id` INTEGER NOT NULL,
                                       `title` VARCHAR(255) NOT NULL,
    `published_at` TEXT,
    `status` TINYINT,
    `description` TEXT NOT NULL,
    `thumbnail` VARCHAR(255),
    `is_featured` TINYINT,
    `subtitle` VARCHAR(255),
    `created_at` TEXT NOT NULL,
    `deleted_at` TEXT,
    `modified_at` TEXT NOT NULL,
    `author_name` VARCHAR(255),
    `read_time` INTEGER,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE IF NOT EXISTS `post_tags` (
                                           `post_id` INTEGER NOT NULL,
                                           `tag_id` INTEGER NOT NULL,
                                           FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
    );

CREATE TABLE IF NOT EXISTS `users` (
                                       `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                       `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `is_admin` TINYINT NOT NULL
    );

CREATE TABLE IF NOT EXISTS `posts_likes` (
                                             `id` INTEGER PRIMARY KEY AUTOINCREMENT,
                                             `post_id` INTEGER NOT NULL,
                                             `user_id` INTEGER NOT NULL,
                                             `likes_id` INTEGER NOT NULL,
                                             FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    FOREIGN KEY (`likes_id`) REFERENCES `likes` (`id`)
    );

CREATE INDEX IF NOT EXISTS `posts_likes_post_id_user_id_index` ON `posts_likes` (`post_id`, `user_id`);
CREATE INDEX IF NOT EXISTS `posts_likes_post_id_index` ON `posts_likes` (`post_id`);
CREATE INDEX IF NOT EXISTS `posts_likes_user_id_index` ON `posts_likes` (`user_id`);

COMMIT;