import express from "express";

import {
  predictHealth
} from "../controllers/mlController.js";

const Router = express.Router();

Router.post("/predict", predictHealth);

export default Router;