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
  authorID: string;
  price?: number;
  title?: string;
  description?: string;
};

export type DeleteBookReqBody = {
  authorID: string;
};
