require('dotenv').config()
const express=require('express')
const path=require('path')
const port=process.env.PORT
const publicPath=path.join(__dirname,'/../public')
// console.log(__dirname+"/../public");
// console.log();
const app=express();
app.use(express.static(publicPath))


app.listen(port,()=>{
    console.log(`Running at port ${port}`);
})