// import express from "express";
// const Router = express.Router(); 
// import{login,Signup} from "../controller/userController.js"
// import {signupValidation,loginValidation} from "../middlewares/validation.js";
// import {auth} from "../middlewares/userAuth.js"


// Router.post("/login",loginValidation,login)

// Router.post("/signup",signupValidation,Signup)

// Router.get("/islogin", auth , (req,res)=>
   
// {
//     //token se nikalo ki ye admin hai ya ni agar admin hua tho msg bhjenge admin
//     console.log("bhai",req.user);
//     if(req.user.role==="admin")
//     {
//       return res.json({message:"admin"});
//     }
//     res.json({message:"already login"});
// })


// Router.get("/islogout", (req, res) => {
//   res.clearCookie("token", {
//   httpOnly: true,
//   secure: false,
//   sameSite: "lax",
//   });

//   return res.json({ message: "logout successfully" });
// });


// Router.get("/userdata",auth,(req,res)=>{
//   console.log({firstname:req.user.firstname,
//               lastname:req.user.lastname,
//               email:req.user.email,
//               password:req.user.password});

//     res.json({firstname:req.user.firstname,
//               lastname:req.user.lastname,
//               email:req.user.email,
//               password:req.user.password
//             })

// });

// //normal profile me update hoskata hai 
// Router.post("/updateuserdata",auth,(req,res)=>{
//   const {firstname,lastname,email}=req.body;
  
// })

// export default  Router;








import express from "express";
const Router = express.Router(); 
import{login,Signup} from "../controller/userController.js"
import {signupValidation,loginValidation} from "../middlewares/validation.js";
import {auth} from "../middlewares/userAuth.js"


Router.post("/login",loginValidation,login)

Router.post("/signup",signupValidation,Signup)

Router.get("/islogin", auth , (req,res)=>
   
{
    //token se nikalo ki ye admin hai ya ni agar admin hua tho msg bhjenge admin
    console.log("bhai",req.user);
    if(req.user.role==="admin")
    {
      return res.json({message:"admin"});
    }
    res.json({message:"already login"});
})


Router.get("/islogout", (req, res) => {
  res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  });

  return res.json({ message: "logout successfully" });
});


Router.get("/userdata",auth,(req,res)=>{
  console.log({firstname:req.user.firstname,
              lastname:req.user.lastname,
              email:req.user.email,
              password:req.user.password});

    res.json({firstname:req.user.firstname,
              lastname:req.user.lastname,
              email:req.user.email,
              password:req.user.password
            })

});

//normal profile me update hoskata hai 
Router.post("/updateuserdata",auth,(req,res)=>{
  const {firstname,lastname,email}=req.body;
  
})

export default  Router;
