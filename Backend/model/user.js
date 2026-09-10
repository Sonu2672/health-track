




import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
      required:true
      // required: function () {
      //   return !this.googleId;
      // },
    },

    // googleId: {
    //   type: String,
    //   default: null,
    // },

   role: {
  type: String,
  enum: ["doctor", "admin", "patient"],
  required: true
   }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", userSchema);
