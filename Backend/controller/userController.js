import user from "../model/user.js";
import device from "../model/device.js";
import doctor from "../model/doctor.js";
// import device from "../model/device.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
export const login = async (req, res) => {
  const { email, password ,role} = req.body;


  try {
    const result = validationResult(req);
    console.log("result= ",result);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }




      if(role==="doctor")
      {
    const doctord=await doctor.findOne({email});
       if (!doctord) {
      return res.status(404).json({ message: "email doesnot exist" });
           }

        if(doctord.status==="accepted")
        {
    const checkpass = await bcrypt.compare(password, doctord.password);
    if (checkpass)
   {
     const token = jwt.sign(
      { id: doctord._id ,  
        role: role},
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

      console.log("Cookie set:", doctord._id);
      return res.status(200).json({ message: "login successfully doctor" ,role,success: true,});
}
        }
      return res.json({ message: "Wrong Password doctor "});
     }




//        else if(role==="patient")
//       {
//             const userd = await user.findOne({ email });
            
//       if (!userd) {
//       return res.status(404).json({ message: "email doesnot exist" ,role,success: true});
//       }
//        const checkpass = await bcrypt.compare(password, userd.password);
//     if (checkpass)
//    {
//      const token = jwt.sign(
//       { id: userd._id,
//         role: role
//        },      //header+payload
//       process.env.JWT_SECRET, //signature
//       { expiresIn: "1d" }
//     );

// res.cookie("token", token, {
//   httpOnly: true,
//   secure: true,
//   sameSite: "none",
//   maxAge: 24 * 60 * 60 * 1000,
// });

//       console.log("Cookie set:", userd._id);
//       return res.status(200).json({ message: "login successfully patient",role,success: true});
// }
//     return res.json({ message: "Wrong Password patient "});
//       }


        else if (role === "patient") {

  const userd = await user.findOne({ email });

  if (!userd) {
    return res.status(404).json({
      message: "email does not exist",
      success: false
    });
  }

  const checkpass = await bcrypt.compare(password, userd.password);

  if (!checkpass) {
    return res.json({
      message: "Wrong Password patient",
      success: false
    });
  }

  // Check patient's device
 

  // Create token
  const token = jwt.sign(
    {
      id: userd._id,
      role: role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
  });

           const deviceData = await device.findOne({
    userid: userd._id
  });

  if (!deviceData) {
    return res.status(404).json({
      success: false,
      message: "Device is not linked to this patient"
    });
  }

  console.log("Cookie set:", userd._id);

  return res.status(200).json({
    message: "login successfully patient",
    role,
    success: true
  });
}



         else if(role==="admin")
      {
         const userd = await user.findOne({ email });
            
      if (!userd) {
      return res.status(404).json({ message: "email doesnot exist" });
      }
       const checkpass = await bcrypt.compare(password, userd.password);
    if (checkpass)
   {
     const token = jwt.sign(
      { id: userd._id ,
        role: role},      //header+payload
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
      return res.status(200).json({ message: "login successfully admin sir" ,role,success: true});
}
    return res.json({ message: "Wrong Password admin sir" });
      }

  
      }
      catch (err) {
    res.json({ message: "error", err });
  }
    }
  
    
  



















export const Signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password ,role} = req.body;

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
      role
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
