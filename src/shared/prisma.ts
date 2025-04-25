import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    // {
    //   emit: 'event',
    //   level: 'query',
    // },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

prisma.$on('warn', (e) => {
  console.log(e);
});

prisma.$on('info', (e) => {
  console.log(e);
});

prisma.$on('error', (e) => {
  console.log(e);
});

// prisma.$on('query', (e) => {
//   console.log('Query: ' + e.query);
//   console.log('Params: ' + e.params);
//   console.log('Duration: ' + e.duration + 'ms');
// });

export default prisma;
