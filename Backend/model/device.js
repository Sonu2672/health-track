
import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    oneSignalPlayerId: { 
      type: String, 
      default: null 
    },
  }, // 👈 Yahan fields object close hua aur comma laga
  {
    timestamps: true, // 👈 Yeh options object alag se hai
  }
);

export default mongoose.model("device", deviceSchema);






// import mongoose from "mongoose";

// const deviceSchema = new mongoose.Schema(
//   {
//     deviceId: {
//       type: String,
//       required: true,
//       unique:true,
//       trim: true,
//     },

    
//     userid: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     oneSignalPlayerId: { 
//     type: String, 
//     default: null 
//   },


//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("device", deviceSchema);
