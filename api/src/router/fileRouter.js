import express from 'express';
import * as fileController from '../controller/fileController';

const fileRouter = express.Router();

fileRouter.post('/', fileController.addFile);

fileRouter.get('/:fileId', fileController.findFile);

fileRouter.delete('/:fileId', fileController.removeFile);

export default fileRouter;
