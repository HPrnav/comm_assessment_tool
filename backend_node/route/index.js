const express =require("express")
const userroute =require('./user')
 const router =express.Router()

const app=express()
router.use('/user',userroute);
  
module.exports=router;