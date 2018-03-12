const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')

app.get('/count', (req,res) => {
    res.send('count: ')
})
app.listen(3000, () => {
    console.log('listening to 3000')
})