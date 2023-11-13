const express=require ('express');
const router=express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('../DB/connection');
const User=require('../models/userSchema');

router.get('/', (req,res)=> {
    res.send(`Hello World from router js`)
});

// using promises
// router.post('/register',(req,res) =>{
//     const{name,email,phone,work,password,cpassword}=req.body;

//     if(!name || !email || !phone || !work || !password || !cpassword){
//         return res.status(422).json({error:"Please fill the field correctly"});
//     }

//     User.findOne({email:email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({error:"Email already registered"});
//         }

//         const user=new User({name,email,phone,work,password,cpassword});

//         user.save().then(() => {
//             res.status(201).json({message:"User registered successfuly"});
//         }).catch((err)=>res.status(500).json({error:"Failed to register"}));
//     }).catch(err=>{console.log(err); });
// });


// using async-await
router.post('/register',async(req,res) =>{
    const{name,email,phone,work,password,cpassword}=req.body;

    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error:"Please fill the field correctly"});
    }
    try{
       const userExist = await User.findOne({email:email});
       if(userExist){
        return res.status(422).json({error:"Email already registered"});
    }
    else if(password != cpassword ){
        return res.status(422).json({error:"Passwords not matching"});
    }   
    else{
        const user=new User({name,email,phone,work,password,cpassword});
        await user.save();
        res.status(201).json({message:"User registered successfuly"});
    }


}

    catch (err){
        console.log(err);
    }
});

router.post('/signin', async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password)
        {
            return res.status(400).json({error:"Please fill the data"});
        }

        const userLogin = await User.findOne({email:email});
        // console.log(userLogin);

        if(userLogin){
            const isMatch = await bcrypt.compare(password , userLogin.password);

            const token = await userLogin.generateAuthToken();
            console.log(token);
            res.cookie("jwtoken", token, {
                expires:new Date(Date.now()+25892000000),
                httpOnly: true
            });

            if(!isMatch){
                res.status(400).json({error: "Invalid credentials"});
            }
            else{
                res.json({message: "User signin successful"});
            }
        }
        else {
            res.status(400).json({error: "Invalid credentials"}); 
        }
        

    }
    catch(err)
    {
        console.log(err);
    }
})



module.exports=router;