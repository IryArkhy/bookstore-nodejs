export type CreateBookReqBody = {
  title: string;
  asset: string;
  authorID: string;
  description: string;
  genres: string[];
  price: number;
  year: number;
};

export type GetBooksReqBody = {
  offset?: number;
  limit?: number;
};

export type GetBooksReqQuery = {
  authorID: string;
  genre: string;
  year: string;
};

export type UpdateBookReqBody = {
  price: number;
  bookID: string;
};
