import express from 'express'
import { deleteThumbnail, GenerateThumbnail } from '../controllers/ThumbnailController.js';
import protect from '../middlewares/Auth.js';

const ThumbnailRouter=express.Router();

ThumbnailRouter.post('/generate',protect,GenerateThumbnail)
ThumbnailRouter.delete('/delete/:id',protect,deleteThumbnail)

export default ThumbnailRouter