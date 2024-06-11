const express = require('express')
const dotenv = require("dotenv")
const route = require('./router')
const app = express()
const cors = require('cors')
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

dotenv.config()
app.use(cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Gunakan EJS
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(expressLayouts)
app.use(express.urlencoded({extended:true}))

app.use(cookieParser('secret'))
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.use(express.json())
app.use(route)

app.use("/assets", express.static("assets"));

app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening on port ${process.env.APP_URL}:${process.env.APP_PORT}`)
})