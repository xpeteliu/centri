import * as path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import initAuth from './utils/auth';
import excludeRoutes from './utils/excludeRoutes';
import userRouter from './router/userRouter';
import commentRouter from './router/commentRouter';
import groupRouter from './router/groupRouter';
import postingRouter from './router/postingRouter';
import messageRouter from './router/messageRouter';
import fileRouter from './router/fileRouter';

initAuth();

const openEndpoints = [
  {
    path: '/api/user',
    method: 'POST',
  },
  {
    path: '/api/user/login',
    method: 'POST',
  },
];
const app = express();

app.use(express.json());
app.use(express.static(path.resolve('./build')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(excludeRoutes(openEndpoints, passport.session()));

app.use('/api/comment', commentRouter);
app.use('/api/group', groupRouter);
app.use('/api/posting', postingRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);
app.use('/api/file', fileRouter);

app.get('/*', (_, res) => {
  res.sendFile(path.resolve('./build/index.html'));
});

app.use((_, res) => {
  res.status(404)
    .end();
});

// Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, async () => {
  await mongoose.connect(process.env.DB_URL);
  app.emit('appStarted');
});

app.on('appHalting', async () => {
  await mongoose.connection.close();
  server.close();
});

export default app;
