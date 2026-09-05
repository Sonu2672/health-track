import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
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

    rating: {
      type: Number,
      default: 4.5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    fee: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "👨‍⚕️",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    online: {
      type: Boolean,
      default: true,
    },

    availableToday: {
      type: Boolean,
      default: true,
    },

    languages: [
      {
        type: String,
      },
    ],

    hospital: {
      type: String,
      default: "HealthCare Clinic",
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;