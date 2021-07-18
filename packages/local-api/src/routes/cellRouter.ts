import express, { json } from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createRouter = (fileName: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, fileName);

  router.get('/cells', async (req, res) => {
    try {
      const read = await fs.readFile(fullPath, { encoding: 'utf-8' });
      res.send(JSON.parse(read));
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.writeFile(fullPath, '[]', 'utf-8');
        res.send([]);
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    const { cells }: { cells: Cell[] } = req.body;
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');
    res.send({ status: 'success' });
  });

  return router;
};
