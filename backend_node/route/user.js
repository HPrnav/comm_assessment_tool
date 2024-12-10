const express=require('express')
const {user} =require('../db')
const zod =require('zod')
const {auth_middleware}=require('./middleware')
const jwt=require("jsonwebtoken")
const {JWT_SECRET}=require('./config')

const router=express.Router()


const signupbody=zod.object({
    username:zod.string(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string()

})

router.post('/signup', async(req,res)=>{
    const{success}=signupbody.safeParse(req.body)
    if(!success){
        res.status(400).json({
            message:"error : invalid credential"
        })
    }

    const existinguser= await user.findOne({
        username:req.body.username
})

if(existinguser){
    return res.status(400).json({
        msg:"user already exist"
    })
}

const newuser =await user.create({
username:req.body.username,
password:req.body.password,
firstname:req.body.firstname,
lastname:req.body.lastname
})

const userid=newuser._id

const token = jwt.sign({
    userid
}, JWT_SECRET);


    res.json({
        message: "User created successfully",
        token: token
    })

})

const signinbody=zod.object({
    username:zod.string(),
    password:zod.string() 
})


router.post('/signin',async (req,res)=>{
    try {
        
        const {success} = signinbody.safeParse(req.body);
        if(!success){
           return res.status(400).json({
                message:"invalid credintial type"
            }
            )
        }
        
        const  User = await user.findOne({
            username:req.body.username,
            password:req.body.password
        
        })
         if ( User) {
            const token = jwt.sign({ userid: User._id}, JWT_SECRET);
            console.log("userid is"+User._id)
             res.status(200).json({ msg:"user signed in successfully", token: token })
            return;
        }
        
        
        res.status(400).json({
            message: "Error while logging in"
        })
    } catch (error) {
        res.status(400).json({
            msg:"error while singin"
        })
    }


})


const updatebody=zod.object({
     email:zod.string().email(),
     firstname:zod.string(),
     lastname:zod.string()
})

router.put('/',auth_middleware,async (req,res)=>{
    const {success}=updatebody.safeParse(req.body)
    if(!success){
        return res.status(400).json({
            msg:"error in updatation"
        })
    }
    await user.updateOne(req.body,{
        _id:req.id
    })

    res.status(200).json({
        msg:"user info updated successfully"
    })

})

router.get("/bulk", async (req, res, next) => {
    try {
        const filter = req.query.filter || ""; // Filter is the query parameter

       // Construct the query using regex for case-insensitive search
       const users = await user.find({
           $or: [
               { firstname: { "$regex": filter } },
               { lastname: { "$regex": filter } }
           ]
       });

       if (users ) {
           res.status(200).json({
               users: users.map((item) => ({
                   username: item.username,
                   lastname: item.lastname,
                   firstname: item.firstname,
                   _id: item._id
               }))
           });
       } else {
           res.status(404).json({
               msg: "No users found"
           });
       }
        
    } catch (error) {
        res.status(400).json({
            msg:"error in bulk"
        })
    }
        
});
module.exports= router
