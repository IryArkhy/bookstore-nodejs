import { Book } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextFunction, Request, Response } from 'express';

import { prisma } from '../../db';
import { RequestWithUser } from '../../modules/auth';
import { CustomError, PrismaClientErrorCodes } from '../../types';

import {
  CreateOrderReqBody,
  OrderItem,
  UpdateOrderStatusReqBody,
} from './types';

export const createOrder = async (
  req: RequestWithUser<any, any, CreateOrderReqBody>,
  res: Response,
  next: NextFunction,
) => {
  const { body, user } = req;
  const data: { book: Book; orderInfo: OrderItem }[] = [];

  try {
    await Promise.all(
      body.orderItems.map(async item => {
        const book = await prisma.book.findUniqueOrThrow({
          where: {
            id_authorID: {
              id: item.bookID,
              authorID: item.authorID,
            },
          },
        });
        data.push({ book, orderInfo: item });
      }),
    );

    const order = await prisma.order.create({
      data: {
        userID: user.id,
        totalPrice: data.reduce(
          (total, it) => (total += it.book.price * it.orderInfo.amount),
          0,
        ),
      },
    });

    const orderItems = await prisma.orderItem.createMany({
      data: data.map(it => ({
        orderID: order.id,
        amount: it.orderInfo.amount,
        bookId: it.book.id,
        totalPrice: it.book.price * it.orderInfo.amount,
      })),
    });

    res.status(201);
    res.json({ order: { ...order, orderItems } });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (
  req: Request<
    {
      id: string;
      userID: string;
    },
    any,
    UpdateOrderStatusReqBody
  >,
  res: Response,
  next: NextFunction,
) => {
  const { body, params } = req;

  try {
    const order = await prisma.order.update({
      where: {
        id_userID: {
          id: params.id,
          userID: params.userID,
        },
      },
      data: {
        status: body.status,
      },
    });

    res.status(200);
    res.json({
      order,
    });
  } catch (error) {
    let err: CustomError | Error = error as Error;
    let errorMessage: string = error.message;

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PrismaClientErrorCodes.notFoundOperator) {
        errorMessage = JSON.stringify(error.meta);
      }

      err = new CustomError(errorMessage, 'input');
    }

    next(err);
  }
};

export const getUserOrders = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
      include: {
        orders: {
          include: {
            items: true,
          },
        },
      },
    });

    res.status(200);
    res.json({ orders: user.orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderByID = async (
  req: RequestWithUser<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await prisma.order.findUniqueOrThrow({
      where: {
        id_userID: {
          id: req.params.id,
          userID: req.user.id,
        },
      },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    if (order.userID !== req.user.id) {
      res.status(401);
      res.json({
        message: 'Insufficient permissions.',
      });
    } else {
      res.status(200);
      res.json({
        order,
      });
    }
  } catch (error) {
    next(error);
  }
};
