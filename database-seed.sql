CREATE TABLE IF NOT EXISTS users
(
    id          BIGSERIAL PRIMARY KEY,
    firstname   VARCHAR(250) NOT NULL,
    lastname    VARCHAR(250) NOT NULL,
    username    VARCHAR(250) NOT NULL UNIQUE,
    password    VARCHAR(151) NOT NULL,
    profile_pic TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS languages
(
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(50) UNIQUE,
    code       CHAR(2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS lessons
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    lesson_text text         NOT NULL,
    language_id BIGINT       NOT NULL REFERENCES languages (id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT current_timestamp
);


CREATE TABLE IF NOT EXISTS courses
(
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    active_lesson BIGINT       NOT NULL,
    owner         BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS course_lesson
(
    course_id  BIGINT REFERENCES courses ON DELETE CASCADE ,
    lesson_id  BIGINT REFERENCES lessons ON DELETE CASCADE ,
    PRIMARY KEY (course_id, lesson_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
)
