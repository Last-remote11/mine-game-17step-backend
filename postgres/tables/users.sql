BEGIN TRANSACTION;

CREATE TABLE users (
  id serial PRIMARY KEY,
  name VARCHAR(100) unique NOT NULL,
  hash TEXT NOT NULL
);

COMMIT;