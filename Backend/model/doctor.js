import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {


     firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required:true,
    
    },

    phone:{
      type:Number,
      required:true,
    },
 

    qualification: {
      type: String,
      required: true,
    },
   
    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: false,
    },


     
    // rating: {
    //   type: Number,
    //   default: 4.5,
    // },

    // reviews: {
    //   type: Number,
    //   default: 0,
    // },

    // fee: {
    //   type: Number,
    //   required: true,
    // },

    // image: {
    //   type: String,
    //   default: "👨‍⚕️",
    // },

    // gender: {
    //   type: String,
    //   enum: ["Male", "Female", "Other"],
    // },

    // online: {
    //   type: Boolean,
    //   default: true,
    // },

    // availableToday: {
    //   type: Boolean,
    //   default: true,
    // },


  },
  {
    timestamps: true,
  }
);

export default mongoose.model("doctor", doctorSchema);