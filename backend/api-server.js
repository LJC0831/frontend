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
app.post('/api/memos', (req, res) => {

    memos.push(req.body.content);
    res.send(memos);
});

app.put('/api/memos/:idx', (req, res) => {
    memos[req.params.idx] = req.body.content;
    res.send(memos);
});

app.listen(port, () => {
    console.log('Example app listening at http://localhost:3000')
});

