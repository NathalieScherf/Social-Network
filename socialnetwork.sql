
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
