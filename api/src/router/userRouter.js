import express from 'express';
import * as userController from '../controller/userController';

const userRouter = express.Router();

userRouter.post('/', userController.addUser);

userRouter.post('/login', userController.loginUser);

userRouter.post('/logout', userController.logoutUser);

userRouter.post('/filter/paginate', userController.queryUsers);

userRouter.post('/filter/count', userController.countUsers);

userRouter.get('/:userId', userController.findUser);

userRouter.put('/:userId', userController.updateUser);

userRouter.delete('/:userId', userController.removeUser);

userRouter.get('/:userId/joinedGroup', userController.queryUserJoinedGroups);

userRouter.get('/:userId/pendingGroup', userController.queryUserPendingGroups);

export default userRouter;
