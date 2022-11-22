import { Request, Response } from 'express';

export const getBooks = (req: Request, res: Response) => {
  res.status(200);
  res.json({
    id: 'book',
    title: 'Plague',
  });
};
