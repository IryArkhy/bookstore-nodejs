export class CustomError extends Error {
  public statusCode?: number;
  public type?: 'auth' | 'input' | 'custom';

  constructor(
    message: string,
    type: CustomError['type'],
    statusCode: number = 500,
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
  }
}

export enum PrismaClientErrorCodes {
  valueTooLong = 'P2000',
  recordNotExist = 'P2001',
  uniqueConstraint = 'P2002',
  foreignKeyConstraint = 'P2003',
  notFoundOperator = 'P2025',
}
