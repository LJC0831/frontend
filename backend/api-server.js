const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");

const memos = ["메모내용1", "메모내용2", "메모내용3"];
app.use(bodyParser.json());

app.get('/api/memos', (req, res) => {
    res.send(memos);
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

