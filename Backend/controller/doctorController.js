import doctor from "../model/doctor.js";
import bcrypt from "bcrypt";

export const doctorRegister = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    phone,
    qualification,
    specialization,
    experience,
  } = req.body;
  const hpassword = await bcrypt.hash(password, 10);
  try {
       const dc= await doctor.create({
            firstname,
            lastname,
            email,
            password:hpassword,
            phone,
            qualification,
            specialization,
            experience,
            status:"pending"
        })
        res.status(200).json({success:true,message:"doctor register sucessfully"})


  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};






export const getdoctorRequest=async(req,res)=>{
  try{
         const pendingdata = await doctor.find({ status: "pending" });
         res.status(200).json({
          pendingdata
         })

  }

 catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}






export const  doctorRequestStaus=async(req,res)=>{
  try{
     const {id}=req.body;
     const doctorid=await doctor.findById(id);
      doctorid.status="accepted";
        await doctorid.save();
      res.status(200).json({message:"request accepted"});
  }

   catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}