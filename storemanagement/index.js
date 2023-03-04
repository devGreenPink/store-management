const express=require('express')
const app=express()
const path=require('path')
const session=require('express-session')
const router=require('./routes/route.js')
const port=8080

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(express.urlencoded({extended:false}))

app.use(session({
    secret:"mysession",
    resave:false,
    saveUninitialized:false
}))

app.use(router)

app.use(express.static(path.join(__dirname,'/public')))
console.log(__dirname)


app.listen(port,()=>{
    console.log(`port: ${port} is connected.`)
})

