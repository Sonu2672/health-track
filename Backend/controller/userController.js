import user from "../model/user.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = validationResult(req);
    console.log("result= ",result);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }


    const userd = await user.findOne({ email });
     
    if(userd.role==="admin")
    {
     

      const token = jwt.sign(

      { 
        id: userd._id,
        role:userd.role,
        email:userd.email, 
       },   
                               //header+payload
      process.env.JWT_SECRET, //signature
      { expiresIn: "1d" }
    );

 res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
});

 return res.status(200).json({message:"admin"});
    }

    console.log(userd);
    if (!userd) {
      return res.status(404).json({ message: "email doesnot exist" });
    }

    const checkpass = await bcrypt.compare(password, userd.password);
    if (checkpass)
   {
     const token = jwt.sign(
      { id: userd._id },      //header+payload
      process.env.JWT_SECRET, //signature
      { expiresIn: "1d" }
    );

res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
});
      console.log("Cookie set:", userd._id);
      return res.status(200).json({ message: "login successfully" });
    }
    res.json({ message: "Wrong Password" });
  } catch (err) {
    res.json({ message: "error", err });
  }
};





// export const Signup = async (req, res) => {
//   const { firstname, email, password } = req.body;
//   // console.log(data);

//   try {
//     const result = validationResult(req);

//     if (!result.isEmpty()) {
//       return res.status(400).json({ errors: result.array() });
//     }
//     const hpassword = await bcrypt.hash(password, 5);
//     await user.create({ firstname, email, password: hpassword });
//     res.json({ message: "signup successfully" });
//   } catch (err) {
//     res.json({ message: "something error in signup" });
//   }
// };

export const Signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        message: result.array()[0].msg
      });
    }

    // 🔥 1. Check if email already exists
    const existingUser = await user.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    // 🔥 2. Hash password
    const hpassword = await bcrypt.hash(password, 10);

    // 🔥 3. Create user
    await user.create({
      firstname,
      lastname,
      email,
      password: hpassword,
      
    });

    return res.status(201).json({
      message: "Signup successful"
    });

  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong during signup"
    });
  }
};