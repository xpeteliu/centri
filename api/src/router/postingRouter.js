import express from 'express';
import * as postingController from '../controller/postingController';

const postingRouter = express.Router();

postingRouter.post('/', postingController.addPosting);

postingRouter.post('/filter/paginate', postingController.queryPostings);

postingRouter.post('/filter/count', postingController.countPostings);

postingRouter.get('/:postingId', postingController.findPosting);

postingRouter.put('/:postingId', postingController.updatePosting);

postingRouter.delete('/:postingId', postingController.removePosting);

postingRouter.put('/:postingId/hide', postingController.hidePosting);

export default postingRouter;
