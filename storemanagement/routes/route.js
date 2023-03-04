const express=require('express')
const router=express.Router()
const Product=require('../models/database')
const multer=require('multer')

router.get('/',(req,res)=>{

    Product.find().exec((err,doc)=>{
        res.render('index.ejs',{products:doc})
    })
    
})
router.get('/log-out',(req,res)=>{
    req.session.destroy((err)=>{
        res.redirect('/')
     })
    
    
 })

const storage = multer.diskStorage({
    destination:function(req,file,callback){
         callback(null,'./public/images/products') //ตำแหน่งจัดเก็บไฟล์
    },
    filename:function(req,file,callback){
       callback(null,Date.now()+".jpg") //เปลี่ยนชื่อไฟล์ ป้องกันชื่อซ้ำ
    }
 })

router.get('/add-product',(req,res)=>{
    const route="add-product"
    if(req.session.status)
    {
        res.render('insertForm.ejs')
    }else{
        res.render('admin',{route:route})
    }
    
})

router.get('/store-management',(req,res)=>{
    const route="store-management"

    if(req.session.status)
    {
        Product.find().exec((err,doc)=>{
            
            res.render('manage.ejs',{products:doc})
         })
    }else{
        res.render('admin',{route:route})
    }
})

router.get('/:id',(req,res)=>{
    const product_id=req.params.id
    Product.findOne({_id:product_id}).exec((err,doc)=>{
        res.render('productdata',{product:doc})
    })
})

router.get('/delete/:id',(req,res)=>{
    const product_id=req.params.id

    Product.findByIdAndDelete(product_id,{useFindAndModify:false}).exec(err=>{
        if(err){
            console.log(err)
            
        }
        res.redirect('/store-management')
    })
})

const upload=multer({
    storage:storage
 })



 router.post('/insert',upload.single("image"),(req,res)=>{
    
    
    let data=new Product({
        name:req.body.name,
      price:req.body.price,
      image:req.file.filename,
      description:req.body.description

    })
    //console.log(product)
    Product.saveProduct(data,(err)=>{
        if(err)console.log(err)
        res.redirect('/')
    })
})

router.post('/edit',(req,res)=>{
    const product_id=req.body.edit_id
    Product.findOne({_id:product_id}).exec((err,doc)=>{
        res.render('edit',{product:doc})
    })
})
router.post('/update',(req,res)=>{
    const update_id=req.body.update_id

    let data={
        name:req.body.name,
        price:req.body.price,
        description:req.body.description
    }

    Product.findByIdAndUpdate(update_id,data,{useFindAndModify:false}).exec(err=>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/store-management')
        }
    })
})

router.post('/admin',(req,res)=>{
    const username=req.body.username
    const password=req.body.password
    const timeExp=300000
    const route=req.body.route


    if(username==="admin"&&password==="369852"){
        req.session.username=username
        req.session.password=password
        req.session.status=true
        req.session.cookie.maxAge=timeExp
        if(route=="store-management"){
            res.redirect('/store-management')
        }
        if(route=="add-product"){
            res.redirect('/add-product')
        }
        
    }else{
        res.redirect('admin',{route:route})
    }
})

module.exports=router