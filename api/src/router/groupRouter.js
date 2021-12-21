import express from 'express';
import * as groupController from '../controller/groupController';

const groupRouter = express.Router();

groupRouter.post('/', groupController.addGroup);

groupRouter.post('/filter/sort', groupController.queryGroups);

groupRouter.get('/:groupId', groupController.findGroup);

groupRouter.get('/:groupId/member/:userId', groupController.findGroupMember);

groupRouter.put('/:groupId/member/:userId', groupController.updateGroupMember);

groupRouter.delete('/:groupId/member/:userId', groupController.removeGroupMember);

groupRouter.put('/:groupId/tag/:tagName', groupController.addGroupTag);

groupRouter.delete('/:groupId/tag/:tagName', groupController.removeGroupTag);

export default groupRouter;
