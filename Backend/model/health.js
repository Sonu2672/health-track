import mongoose from "mongoose";

const healthSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      
      trim: true,
    },

    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    heartRate: {
      type: Number,
      default: 0,
    },

    spo2: {
      type: Number,
      default: 0,
    },

    temp: {
      type: Number,
      default: 0,
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    //  envtemp: {
    //   type: Number,
    //   default: 0,
    // },

    //  aqi: {
    //   type: Number,
    //   default: 0,
    // },

    //  humidity: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("health", healthSchema);
