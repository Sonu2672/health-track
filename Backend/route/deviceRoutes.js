import express from "express";
const Router = express.Router(); 
// import { checkLike ,upload ,getpost,deletepost , editpost} from "../controller/healthController.js";
import {auth} from "../middlewares/userAuth.js"
import { deviceRegister} from "../controller/deviceController.js";
// import {receiveDeviceData} from "../controller/deviceController.js";
// import {getdevicedata} from "../controller/deviceController.js"
// import {updateHealthData} from "../controller/deviceController.js"

// Router.get("/",auth,getdevicedata);
// Router.post("/",receiveDeviceData);
Router.post("/register",auth,deviceRegister);
// Router.get("/healthMonitor",auth,getdevicedata);
// Router.get("/riskAnalysis",auth,getdevicedata);
// router.post("/register", auth, registerDevice);
// router.post("/health-data", updateHealthData);
export default Router;