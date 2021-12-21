import mongoose from 'mongoose';
import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';

const storage = new GridFsStorage({ db: mongoose.connection });
const upload = multer({ storage })
  .single('file');

let gfs;
mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
});

export const addFile = (req, res) => {
  upload(req, res, (e) => {
    if (e) {
      res.status(400)
        .json({ message: e.message });
    } else {
      res.json(req.file);
    }
  });
};

export const findFile = (req, res) => {
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
};

export const removeFile = async (req, res) => {
  try {
    await gfs.delete(new mongoose.Types.ObjectId(req.params.fileId));
    res.status(204)
      .end();
  } catch (e) {
    res.status(e.message.startsWith('File not found') ? 404 : 400)
      .json({ message: e.message });
  }
};
