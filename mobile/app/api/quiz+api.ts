import app from '@/src/server/app';

export const POST = (request: Request) => app.fetch(request);
