const mongoose=require('mongoose')

const url='mongodb://127.0.0.1:27017/storemanagementDB'
mongoose.set('strictQuery',true)
mongoose.connect(url,{
    useNewUrlParser: true, useUnifiedTopology: true
}).catch(err=>console.log(err))

let schema=mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    description:String
})


let Product=mongoose.model("products",schema)

module.exports=Product

module.exports.saveProduct=function(model,data){
    model.save(data)

}