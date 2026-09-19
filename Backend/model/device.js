import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique:true,
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


  {
    timestamps: true,
  }
);

export default mongoose.model("device", deviceSchema);
