import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createRouter } from './routes/cellRouter';

export const serve = (
  fileName: string,
  dir: string,
  port: number,
  isProduction: boolean
) => {
  const app = express();

  app.use(createRouter(fileName, dir));

  if (isProduction) {
    const packPath = require.resolve('@mgcode/local-client/build/index.html');
    app.use(express.static(path.dirname(packPath)));
  } else {
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:3000',
        ws: true,
        logLevel: 'silent',
      })
    );
  }

  return new Promise<void>((resolve, reject) =>
    app.listen(port, resolve).on('error', reject)
  );
};
