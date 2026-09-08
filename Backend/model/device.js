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

    // heartRate: {
    //   type: Number,
    //   default: 0,
    // },

    // spo2: {
    //   type: Number,
    //   default: 0,
    // },

    // temp: {
    //   type: Number,
    //   default: 0,
    // },

    // riskScore: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("device", deviceSchema);
