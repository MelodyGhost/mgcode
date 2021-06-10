import path from 'path';
import { Command } from 'commander';
import { serve } from '@mgcode/local-api';

const isProduction = process.env.NODE_ENV === 'production';
export const serveCommand = new Command()
  .command('serve [fileName]')
  .description('Open and Edit a notebook in js')
  .option('-p, --port <portNumber>', 'Port to run on server', '4005')
  .action(async (fileName = 'notebook.js', options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(fileName));
      await serve(path.basename(fileName), dir, +options.port, isProduction);
      console.log(
        `Opened ${fileName}. Navigate to http://localhost:${options.port} to read or edit!`
      );
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        console.error(
          'Application already running on this port, use different port'
        );
      } else {
        console.error(err.message);
      }
      process.exit(1);
    }
  });
