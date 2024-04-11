CREATE TABLE threads (threadId SERIAL PRIMARY KEY, title text, text text, createdAt date);
CREATE TABLE posts (postId SERIAL PRIMARY KEY, threadId INTEGER, text text, createdAt date);