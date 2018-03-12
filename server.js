const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')

app.use(cookieParser());

const products = {
    1:{title:'the history of web'},
    2:{title:'the next web'}
}

app.get('/products', (req,res) => {
    let output = ''
    for(let name in products) {
        output += 
        `<li>
       <a href="/cart/${name}"> ${products[name].title}</a>
        </li>`
    }
    res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`)
})

app.get('/cart/:id', (req,res) => {
    let id = req.params.id;
    let cart;
    if(req.cookies.cart) {
        cart = req.cookies.cart;
    }
    else {
        cart = {};
    }

    if(!cart[id]) {
        cart[id] = 0;
    }
    cart[id] = parseInt(cart[id])+1
    res.cookie('cart',cart);
    // res.send(cart)
    res.redirect('/cart')
})

app.get('/cart', (req,res) => {
    let cart = req.cookies.cart;
    let output =''
    if(!cart) {
        res.send('empty')
    }
    else {
        for(let id in cart) {
            output += `<li>${products[id].title}(${cart[id]})`
        }
    }
    res.send(`<h1>CART</h1><ul>${output}</ul> <a href="/products">back to product list</a>`)
})

// app.get('/count', (req,res) => {
//     let count;
//     if(req.cookies.count) {
//         count = parseInt(req.cookies.count)+1
//     }
//     else {
//         count = 0;
//     }
//     res.cookie('count', count)
//     res.send('count:' + count)
// })
app.listen(3000, () => {
    console.log('listening to 3000')
})