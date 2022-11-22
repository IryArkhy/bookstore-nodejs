import { Request, Response } from 'express';

export const getBooks = async (req: Request, res: Response) => {
  res.status(200);
  res.json({
    id: 'book',
    title: 'Plague',
  });
};

export const updateBook = async (req: Request, res: Response) => {
  res.json({ message: 'book updated' });
};
