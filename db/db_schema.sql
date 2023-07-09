PRAGMA
foreign_keys = ON;

-- Create Tables ...

CREATE TABLE comments
(
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id      INTEGER  NOT NULL,
    comment      TEXT     NOT NULL,
    created_at   DATETIME NOT NULL,
    updated_at   DATETIME NOT NULL,
    parent_id    INTEGER NULL,
    user_id      INTEGER  NOT NULL,
    published_at DATETIME NULL
);

CREATE INDEX comments_post_id_reader_id_index ON comments (post_id, reader_id);
CREATE INDEX comments_post_id_id_reader_id_parent_id_index ON comments (post_id, id, reader_id, parent_id);
CREATE INDEX comments_post_id_index ON comments (post_id);

CREATE TABLE likes
(
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    reaction TEXT NULL,
    type     TEXT NULL
);

CREATE TABLE categories
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT     NOT NULL,
    sort       INTEGER NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE TABLE posts
(
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER  NOT NULL,
    title        TEXT     NOT NULL,
    published_at DATETIME NULL,
    status       INTEGER NULL DEFAULT 0,
    description  TEXT     NOT NULL,
    thumbnail    TEXT NULL,
    is_featured  INTEGER NULL,
    subtitle     TEXT NULL,
    created_at   DATETIME NOT NULL,
    deleted_at   DATETIME NULL,
    updated_at   DATETIME NOT NULL,
    author_name  TEXT NULL,
    read_visits  INTEGER NULL
);


CREATE TABLE post_categories
(
    post_id     INTEGER NOT NULL,
    category_id INTEGER NOT NULL
);


CREATE TABLE post_tags
(
    post_id INTEGER NOT NULL,
    tag_id  INTEGER NOT NULL
);

CREATE TABLE users
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT    NOT NULL,
    email     TEXT    NOT NULL,
    password  TEXT    NOT NULL,
    is_admin  INTEGER NOT NULL,
    thumbnail TEXT NULL,
    `bio`     TEXT    NOT NULL
);

CREATE TABLE posts_likes
(
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id  INTEGER NOT NULL,
    user_id  INTEGER NOT NULL,
    likes_id INTEGER NOT NULL
);


CREATE INDEX posts_likes_post_id_index ON posts_likes (post_id);
CREATE INDEX posts_likes_user_id_index ON posts_likes (user_id);

CREATE TABLE tags
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE general_settings
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    mate_data TEXT NOT NULL,
    `key`     TEXT NOT NULL,
    `value`   TEXT NOT NULL
);

CREATE TABLE seo_mate_date
(
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL,
    desc    INTEGER NOT NULL,
    post_id INTEGER NULL
);

-- Create Indexes ...
CREATE INDEX seo_mate_date_post_id_index ON seo_mate_date (post_id);

CREATE INDEX post_tags_post_id_tag_id_index ON post_tags (post_id, tag_id);

CREATE INDEX post_categories_post_id_category_id_index ON post_categories (post_id, category_id);

CREATE INDEX posts_likes_post_id_likes_id_index ON posts_likes (post_id, likes_id);

CREATE INDEX posts_user_id_id_index ON posts (user_id, id);

CREATE INDEX posts_likes_post_id_user_id_index ON posts_likes (post_id, user_id);


-- Insert Initial Data

INSERT INTO `users` (`full_name`, `email`, `password`, `is_admin`, `thumbnail`, `created_at`, `updated_at`)
VALUES ('Admin Uol', 'admin@admin.com', '$2b$10$Bm5sckOg.3Tn0pqDo.Krfu8bmHjahK8lfD/IYAHZuZUPRuFyA9bLS', 1, 'https://source.unsplash.com/collection/1346951/150x150?sig=1', 1688869180, 1688869180);

INSERT INTO `general_settings` (`key`, `value`, `mate_data`)
VALUES ('title', 'Blogging Tools!', '{}'),
       ('keywords', 'blog,seo,university of london, london, uol', '{}'),
       ('author', 'Hamza Zymawy', '{}'),
       ('subtitle', 'Tool For Writers!', '{}');