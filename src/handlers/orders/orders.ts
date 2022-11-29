import { Book } from '@prisma/client';
import { Response } from 'express';

import { prisma } from '../../db';
import { RequestWithUser } from '../../modules/auth';

import {
  CreateOrderReqBody,
  OrderItem,
  UpdateOrderStatusReqBody,
} from './types';

export const createOrder = async (
  req: RequestWithUser<any, any, CreateOrderReqBody>,
  res: Response,
) => {
  const { body, user } = req;
  const data: { book: Book; orderInfo: OrderItem }[] = [];

  try {
    await Promise.all(
      body.orderItems.map(async item => {
        const book = await prisma.book.findUnique({
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
    console.log(error);
    res.status(500);
    res.json({ message: 'Error' });
  }
};

export const updateOrder = async (
  req: RequestWithUser<
    {
      id: string;
    },
    any,
    UpdateOrderStatusReqBody
  >,
  res: Response,
) => {
  const { user, body, params } = req;

  if (user.role !== 'ADMIN') {
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
    const order = await prisma.order.update({
      where: {
        id_userID: {
          id: params.id,
          userID: user.id,
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
  }
};

export const getUserOrders = async (req: RequestWithUser, res: Response) => {
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
