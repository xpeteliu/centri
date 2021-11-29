import * as path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './router/userRouter';
import commentRouter from './router/commentRouter';
import groupRouter from './router/groupRouter';
import postingRouter from './router/postingRouter';
import privateMessageRouter from './router/privateMessageRouter';

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.static(path.resolve('./build')));
app.use('/comment', commentRouter);
app.use('/group', groupRouter);
app.use('/posting', postingRouter);
app.use('/privateMessage', privateMessageRouter);
app.use('/user', userRouter);

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
