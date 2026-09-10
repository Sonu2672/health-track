import express from "express";

import {doctorRegister,getdoctorRequest, doctorRequestStaus } from "../controller/doctorController.js";

const Router = express.Router();

Router.post("/doctorReg", doctorRegister);
Router.get("/doctorRequest", getdoctorRequest);
Router.post("/doctorReq", doctorRequestStaus);
export default Router;
