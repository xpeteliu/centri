import express from 'express';
import * as messageController from '../controller/messageController';

const messageRouter = express.Router();

messageRouter.post('/', messageController.addMessage);

messageRouter.post('/filter/paginate', messageController.queryMessages);

messageRouter.post('/filter/count', messageController.countMessages);

messageRouter.put('/:messageId', messageController.updateMessage);

messageRouter.put('/:messageId/accept', messageController.acceptInvitationMessage);

messageRouter.put('/:messageId/decline', messageController.declineInvitationMessage);

export default messageRouter;
