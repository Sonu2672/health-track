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
     
//     if(userd.role==="admin")
//     {
     

//       const token = jwt.sign(

//       { 
//         id: userd._id,
//         // role:userd.role,
//         email:userd.email, 
//        },   
//                                //header+payload
//       process.env.JWT_SECRET, //signature
//       { expiresIn: "1d" }
//     );

//  res.cookie("token", token, {
//   httpOnly: true,
//   secure: false,
//   sameSite: "lax",
//   maxAge: 24 * 60 * 60 * 1000,
// });

//  return res.status(200).json({message:"admin"});
//     }

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
  secure: false,
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
});
      console.log("Cookie set:", userd._id);
      return res.status(200).json({ message: "login successfully" });
    }
    return res.json({ message: "Wrong Password" });
  } catch (err) {
    res.json({ message: "error", err });
  }
};





export const Signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // 1️⃣ Validation
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: result.array()[0].msg,
      });
    }

    // 2️⃣ Check existing email
    const existingUser = await user.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // 3️⃣ Hash password
    const hpassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const newUser = await user.create({
      firstname,
      lastname,
      email,
      password: hpassword,
    });

    // 5️⃣ Success response
    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
      },
    });

  } catch (err) {
    console.error("❌ SIGNUP ERROR FULL:", err);
    console.error("❌ MESSAGE:", err.message);
    console.error("❌ STACK:", err.stack);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};
