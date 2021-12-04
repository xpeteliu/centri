import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const fileRouter = express.Router();

const storage = new GridFsStorage({ db: mongoose.connection });
const upload = multer({ storage })
  .single('file');

let gfs;
mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
});

fileRouter.post('/', (req, res) => {
  upload(req, res, (e) => {
    if (e) {
      res.status(400)
        .json({ message: e.message });
    } else {
      res.json(req.file);
    }
  });
});

fileRouter.get('/:fileId', (req, res) => {
  try {
    const stream = gfs.openDownloadStream(new mongoose.Types.ObjectId(req.params.fileId));
    stream.on('error', (e) => {
      res.status(e.message.startsWith('FileNotFound') ? 404 : 400)
        .json({ message: e.message });
    });
    stream.pipe(res);
  } catch (e) {
    res.status(400)
      .json({ message: e.message });
  }
});

fileRouter.delete('/:fileId', async (req, res) => {
  try {
    await gfs.delete(new mongoose.Types.ObjectId(req.params.fileId));
    res.status(204)
      .end();
  } catch (e) {
    res.status(e.message.startsWith('File not found') ? 404 : 400)
      .json({ message: e.message });
  }
});

export default fileRouter;
