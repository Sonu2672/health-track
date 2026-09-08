import express from "express";
const Router = express.Router(); 
// import { checkLike ,upload ,getpost,deletepost , editpost} from "../controller/healthController.js";
import {auth} from "../middlewares/userAuth.js"
import {gethealthdata,healthData,getHealthHistory} from "../controller/healthController.js";

// Router.get("/islike",auth,checkLike);
// Router.post("/",auth,upload)
// Router.get("/getpost",auth,getpost)
// Router.delete("/:id",auth,deletepost)
// Router.put("/:id",auth,editpost);

// Router.post("/healthdata",auth,healthData);
Router.get("/gethealthdata",auth,gethealthdata)
Router.post("/healthdata",auth,healthData);
// Router.post("/",auth,receiveDeviceData)
Router.get("/history", auth, getHealthHistory);



Router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Health route working"
  });
});


export default Router;