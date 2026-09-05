import express from "express";

import {
  getDoctors,
  seedDoctors,
} from "../controller/doctorController.js";

const Router= express.Router();

Router.get("/", getDoctors);

// Sirf development ke liye
Router.post("/seed", seedDoctors);

export default Router;