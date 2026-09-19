import express from 'express';
import multer from 'multer';
import { uploadDocument } from '../controller/documentController.js';
import {auth} from "../middlewares/userAuth.js"
const Router = express.Router(); 
// Multer memory storage setup

const upload = multer({ storage: multer.memoryStorage() });

// POST Route: /api/upload-document
Router.post('/uploaddoc', upload.single('document'),auth, uploadDocument);
Router.get('/getdoc',getdocument);
export default Router;
