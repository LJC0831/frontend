const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const database = require("./database");
const memos = [];
app.use(bodyParser.json());

app.get('/api/memos', async (req, res) => {
    const result = await database.run("SELECT * FROM board.memos");
    res.send(result);
});
app.post('/api/memos', async(req, res) => {
    await database.run(`INSERT INTO board.memos (content) value ('${req.body.content}')`);
    const result = await database.run("SELECT * FROM board.memos");
    res.send(result);
});

app.put('/api/memos/:id', async(req, res) => {
    await database.run(`UPDATE board.memos SET content = '${req.body.content}' WHERE id = ${req.params.id}`);
    const result = await database.run("SELECT * FROM board.memos");
    res.send(result);
});

app.listen(port, () => {
    console.log('Example app listening at http://localhost:3000')
});

