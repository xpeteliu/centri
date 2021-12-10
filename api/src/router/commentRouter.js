import express from 'express';
import * as commentController from '../controller/commentController';

const commentRouter = express.Router();

commentRouter.post('/', commentController.addComment);

commentRouter.post('/filter/paginate', commentController.queryComments);

commentRouter.post('/filter/count', commentController.countComments);

commentRouter.get('/:commentId', commentController.findComment);

commentRouter.put('/:commentId', commentController.updateComment);

commentRouter.delete('/:commentId', commentController.removeComment);

export default commentRouter;
