/*
  Warnings:

  - Added the required column `totalPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "totalPrice" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Order_id_userID_idx" ON "Order"("id", "userID");

-- CreateIndex
CREATE INDEX "OrderItem_id_orderID_idx" ON "OrderItem"("id", "orderID");
