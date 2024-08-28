const userRoute=require("./src/user/route.user")
const router=require("express").Router()

router.use("/user",userRoute)


module.exports=router