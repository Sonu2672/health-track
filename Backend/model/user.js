




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
      // required: function () {
      //   return !this.googleId;
      // },
    },

    // googleId: {
    //   type: String,
    //   default: null,
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", userSchema);
