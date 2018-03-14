const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express();
const md5 = require('md5')
const MongoStore = require('connect-mongo')(session);

const salt ='@#$!45212ffafafs'
let user = [
    {
        username:'haru',
        password:'1234',
        displayName: 'dengdeng'
    }
]

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false, // don't create session until something stored
	resave: false, //don't save session if unmodified
    store: new MongoStore({
        url:'mongodb://woojun:spdlxm123@ds113749.mlab.com:13749/sessionstore'
    })
  }))


app.post('/auth/login', (req,res) => {

    for(let i=0; user.length; i++) {
    if(user[i].username === req.body.username && user[i].password === md5(req.body.password+salt))  {
        req.session.displayName = user[i].displayName;
        return req.session.save( ()=> {
            console.log(md5(req.body.password+salt))
            console.log(req.session)
            console.log(user)
         res.redirect('/welcome')
        })
    }
}
    res.send(`<p>Please try again</p> <a href='/auth/login'>login</a>`)
})

app.get('/auth/register', (req,res) => {
    var output = `
    <h1>Register</h1>
    <form action="/auth/register" method="post">
        <input type="text" name="username" placeholder="username">
        <input type="password" name="password" placeholder="password">
        <input type="displayname" name="displayName" placeholer="displayname">
        <input type="submit">
    </form>
    `;
    res.send(output)
})

app.post('/auth/register', (req,res) => {
    let newUser = {
        username:req.body.username,
        password:md5(req.body.password+salt),
        displayName: req.body.displayName
    }
    user.push(newUser)
    req.session.displayName = req.body.displayName;
    return req.session.save(()=> {
        res.redirect('/welcome')
    })
})

app.get('/welcome', function(req, res){
      if(req.session.displayName) {
        res.send(`
          <h1>Hello, ${req.session.displayName}</h1>
          <a href="/auth/logout">logout</a>
        `);
      } else {
        res.send(`
          <h1>Welcome</h1>
          <a href="/auth/login">Login</a>
        `);
      }
    });

app.get('/auth/logout', (req,res) => {
    delete req.session.displayName;
    req.session.save(function() {
        res.redirect('/welcome');
        });
})


app.get('/auth/login', function(req, res){
    var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
    `;
    res.send(output);
  });

app.get('/tmp', (req,res) => {
    res.send('result:'+req.session.count)
})



//---------------------------------------cookies
// const products = {
//     1:{title:'the history of web'},
//     2:{title:'the next web'}
// }

// app.get('/products', (req,res) => {
//     let output = ''
//     for(let name in products) {
//         output += 
//         `<li>
//        <a href="/cart/${name}"> ${products[name].title}</a>
//         </li>`
//     }
//     res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`)
// })

// app.get('/cart/:id', (req,res) => {
//     let id = req.params.id;
//     let cart;
//     if(req.signedCookies.cart) {
//         cart = req.signedCookies.cart;
//     }
//     else {
//         cart = {};
//     }

//     if(!cart[id]) {
//         cart[id] = 0;
//     }
//     cart[id] = parseInt(cart[id])+1
//     res.cookie('cart',cart, {signed:true});
//     res.redirect('/cart')
// })

// app.get('/cart', (req,res) => {
//     let cart = req.signedCookies.cart;
//     let output =''
//     if(!cart) {
//         res.send('empty')
//     }
//     else {
//         for(let id in cart) {
//             output += `<li>${products[id].title}(${cart[id]})`
//         }
//     }
//     res.send(`<h1>CART</h1><ul>${output}</ul> <a href="/products">back to product list</a>`)
// })

// app.get('/count', (req,res) => {
//     let count;
//     if(req.signedCookies.count) {
//         count = parseInt(req.signedCookies.count)+1
//     }
//     else {
//         count = 0;
//     }
//     res.cookie('count', count, {signed:true})
//     res.send('count:' + count)
// })
app.listen(3000, () => {
    console.log('listening to 3000')
})