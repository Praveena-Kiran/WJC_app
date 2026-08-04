import app from '@/src/server/app';

export const GET = (request: Request) => app.fetch(request);
