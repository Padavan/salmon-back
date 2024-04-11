
const express = require('express');
const Queries = require('./queries.js');
const pg = require('pg');
const Validations = require('./validations.js');

/***
 * @typedef {import("./schema.d.ts").components} Components
 **/

const { Pool } = pg
const app = express();
const port = 8001;
 
const pool = new Pool({
  host: 'localhost',
  database: process.env["DB_NAME"],
  user: process.env["DB_USER"],
  password: process.env["DB_PASSWORD"],
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

app.use(express.json());


app.get('/hello', (_req, res) => {
  console.log("hello")
  res.json({"message":"Ok", "data": "Hello World!"})
});

app.use((_req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/board/thread/create', async (req, res) => {
  /** @type {Components["schemas"]["NewThread"]} */
  const newThread = {
    title: req.body.title,
    text: req.body.text,
  };
  const createdAt = new Date().toISOString().replace("T", " ").replace("Z", "");

  try {
    Validations.validateNewThread(newThread);
    await pool.query(Queries.CREATE_THREAD_QUERY, [newThread.title, newThread.text, createdAt]);
    res.json({"message": "ok"})
  } catch (e) {
    let errorMessage = "Unknown error";
    if (e instanceof Error) {
      errorMessage = e.message;
    }

    res.status(400).json({ "error": errorMessage })
  }
});

app.get('/board/threads', async (_, res) => {
  try {
    const result = await pool.query(Queries.GET_THREADS_QUERY);
    /** @type {Components["schemas"]["Thread"][]} */
    const threadList = result.rows.map(r => ({
      threadId: r.threadid,
      createdAt: r.createdat,
      title: r.title,
      text: r.text,
      status: "flagged",
      complete: false,
    }));

    res.json(threadList)
  } catch (e) {
    let errorMessage = "Unknown error";
    if (e instanceof Error) {
      errorMessage = e.message;
    }

    res.status(400).json({ "error": errorMessage })
  }
});

// POSTS
app.post('/board/thread/:threadId/post/create', async (req, res) => {
  console.log("create post", req.params);

  /** @type {Components["schemas"]["NewPost"]} */
  const newPost = {
    text: req.body.text,
  };

  const createdAt = new Date().toISOString().replace("T", " ").replace("Z", "");
  const threadId = req.params.threadId;

  try {
    Validations.validateNewPost(newPost);
    await pool.query(Queries.CREATE_POST_QUERY, [threadId, newPost.text, createdAt]);
    res.json({"message": "ok"})
  } catch (e) {
    let errorMessage = "Unknown error";
    if (e instanceof Error) {
      errorMessage = e.message;
    }

    res.status(400).json({ "error": errorMessage })
  }
});

app.get('/board/thread/:threadId/posts', async (req, res) => {
  const threadId = req.params.threadId;

  console.log("threadId", threadId);

  try {
    const { rows } = await pool.query(Queries.GET_THREAD_POSTS_QUERY, [threadId]);
    /** @type {Components["schemas"]["Post"][]} */
    const postList = rows.map(p => ({
      postId: p.postid,
      threadId: p.threadid,
      text: p.text,
      createdAt: p.createdat,
    }));

    res.json(postList);
  } catch (e) {
    let errorMessage = "Unknown error";
    if (e instanceof Error) {
      errorMessage = e.message;
    }

    res.status(400).json({ "error": errorMessage })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
