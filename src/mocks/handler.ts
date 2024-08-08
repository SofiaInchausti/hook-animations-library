import { http } from 'msw';

export const handlers = [
  http.get('https://api.example.com/data', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Hello, world!' })
    );
  }),
];
