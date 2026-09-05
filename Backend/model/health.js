import mongoose from "mongoose";
const healthSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required:true
  },

  // deviceid:string,
  heartRate: Number,
  spo2: Number,
  temp: Number,
  riskScore:Number,
  

}, {
  timestamps: true
});
export default mongoose.model("health", healthSchema);