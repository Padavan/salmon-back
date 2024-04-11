
const CREATE_THREAD_QUERY = "INSERT INTO threads (title, text, createdAt) VALUES ($1,$2,$3)";

const GET_THREADS_QUERY = "select * from threads";

const CREATE_POST_QUERY = "INSERT INTO posts (threadId, text, createdAt) VALUES ($1,$2,$3)";

const GET_THREAD_POSTS_QUERY = "select * from posts where threadId = $1"

module.exports = {
  CREATE_THREAD_QUERY,
  GET_THREADS_QUERY,
  CREATE_POST_QUERY,
  GET_THREAD_POSTS_QUERY,
}