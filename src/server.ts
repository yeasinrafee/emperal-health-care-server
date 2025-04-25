import { Server } from 'http';
import app from './app';
import config from './config';

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log('Server is running on port: ', config.port);
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server is closed!!');
      });
    }
    process.exit(1);
  };

  process.on('uncaughtException', (err) => {
    console.log(err);
    exitHandler();
  });

  process.on('unhandledRejection', (err) => {
    console.log(err);
    exitHandler();
  });
}
main();
