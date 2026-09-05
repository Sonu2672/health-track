// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {

//   //     deviceId: {
//   //   type: String,
//   //   unique: true,
//   //   default: null
//   // },

//      firstname: {
//       type: String,
//       required: true,
//     },

//      lastname: {
//       type: String,
//       required: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     password: {
//       type: String,
//       required: function () {
//         return !this.googleId;
//       },
//     },

//     googleId: {
//       type: String,
//     },


   
//   },

//   {
//     timestamps: true,
//   },
// );

// export default mongoose.model("user", userSchema);








import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      default: "", // ✅ required: true ki jagah default empty string rakhein
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
      required: function () {
        return !this.googleId;
      },
    },

    googleId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", userSchema);
