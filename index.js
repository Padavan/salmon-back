const express = require('express');
const multer  = require('multer')
const fs = require('fs');
const md5 = require('md5');

const app = express();
const port = 3000;
app.use(express.json());

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.log('cannot open db');
    console.error(err.message);
    throw err;
  } else {
    console.log('create db');
    db.run(`CREATE TABLE threads ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title text,
      text text,
      date INTEGER
    )`, [], (err) => {
      console.log("table already created");
    });

    db.run(`CREATE TABLE comments ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      threadId INTEGER
      comment text,
      date INTEGER
    )`, [], (err) => {
      console.log("table already created");
    });
  }
});

// db.serialize(function() {
  
// });


// const insertNewThreadInDB = (thread) => {
  
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './uploads');
//   },
//   filename: function (req, file, callback) {
//     console.log(file);
//     callback(null, Date.now()+'-'+file.originalname)
//   }
// });


const upload = multer({ dest: './uploads'});

// const upload = multer({storage: storage}).single('file');

app.post('/api/upload', upload.single('file'), function (req, res, next) {
  console.log('req', req);
  console.log('res', res);

  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.send('success');
});

app.get('/api/hello', (req, res) => {
  console.log("hello")
  res.json({"message":"Ok", "data": "Hello World!"})
});

app.post('/api/create-thread', function (req, res) {
  console.log('create-thread', req.body);
  const threadData = {
    title: req.body.title,
    text: req.body.text,
    date: Date.now(),
  };

  db.run('INSERT INTO threads (title, text, date) VALUES (?,?,?)', [threadData.title, threadData.text, threadData.date], (err, test) => {
    if (err) {
      res.status(400).json({"error": error})
    } else {
      res.json({"message": "ok"})
    }
  })

  // insertNewThreadInDB(threadData);

  // res.send({"message":"Ok"});
});

app.get('/api/thread-list', (req, res) => {

  const sql = "select * from threads"
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }

    res.send({
      "message":"ok",
      "data": rows
    })
  });

  // res.send({"message":"Ok"})
});

app.post('/api/add-comment', (req, res) => {
  console.log("req", res.body);

  const commentData = {
    threadId: res.body.threadId,
    comment: res.body.comment,
    date: Date.now(),
  }

  db.run('INSERT INTO comments (threadId, comment, date) VALUES (?,?,?)', [commentData.threadId, commentData.comment, commentData.date], (err, test) => {
    if (err) {
      res.status(400).json({"error": error})
    } else {
      res.json({"message": "ok"})
    }
  });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
