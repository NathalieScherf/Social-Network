DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
id SERIAL PRIMARY KEY,
first VARCHAR (200) NOT NULL,
last VARCHAR (200) NOT NULL,
profilepic TEXT,
bio TEXT,
email VARCHAR (200) NOT NULL UNIQUE CHECK (email<>''),
pass VARCHAR (200) NOT NULL
);

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
