const express = require('express')
const app = express()
const port = 3000

const memos = ["메모내용1", "메모내용2", "메모내용3"];

app.get('/api/memos', (req, res) => {
    res.send(memos)
})

app.listen(port, () => {
    console.log('Example app listening at http://localhost:3000')
})