import { Book } from '@prisma/client';
import { Request, Response } from 'express';
import { json } from 'stream/consumers';

import { prisma } from '../../db';
import { RequestWithUser } from '../../modules/auth';
import { CreateOrderReqBody, OrderItem } from './types';

export const createOrder = async (
  req: RequestWithUser<any, any, CreateOrderReqBody>,
  res: Response,
) => {
  const { body, user } = req;
  const data: { book: Book; orderInfo: OrderItem }[] = [];

  await Promise.all(
    body.orderItems.map(async item => {
      const book = await prisma.book.findFirst({
        where: {
          id: item.bookID,
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

  //   Promise.all(
  //     data.map(item => {
  //       const orderItem = await prisma.orderItem.create();
  //     }),
  //   );

  //   const books = await prisma.book.findMany({
  //     where: {

  //     }
  //   });
  //   const order = await prisma.order.create({
  //     data: {
  //       userID: 'userID',
  //     },
  //   });
};

export const updateOrder = async (req: Request, res: Response) => {};

export const getUserOrders = async (req: RequestWithUser, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      orders: true,
    },
  });

  res.status(200);
  res.json({ orders: user.orders });
};

export const getOrderByID = async (
  req: RequestWithUser<{ id: string }>,
  res: Response,
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: req.params.id,
      //   userId: req.user.id, // findUnique: will work after migration
    },
    include: {
      items: true,
    },
  });

  if (order.userID !== req.user.id) {
    res.status(401);
    res.json({
      errors: [
        {
          code: 401,
          message: 'Insufficient permissions',
        },
      ],
    });
  } else {
    res.status(200);
    res.json({
      order,
    });
  }
};
