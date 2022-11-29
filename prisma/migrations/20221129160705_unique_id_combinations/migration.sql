/*
  Warnings:

  - A unique constraint covering the columns `[id,authorID]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,userID]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,orderID]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Order_id_userID_idx";

-- DropIndex
DROP INDEX "OrderItem_id_orderID_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Book_id_authorID_key" ON "Book"("id", "authorID");

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_userID_key" ON "Order"("id", "userID");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_id_orderID_key" ON "OrderItem"("id", "orderID");
