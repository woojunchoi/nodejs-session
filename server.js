const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')

app.use(cookieParser());

app.get('/count', (req,res) => {
    let count;
    if(req.cookies.count) {
        count = parseInt(req.cookies.count)
    }
    else {
        count = 0;
    }
    count = count + 1
    res.cookie('count', count)
    res.send('count:' + count)
})
app.listen(3000, () => {
    console.log('listening to 3000')
})