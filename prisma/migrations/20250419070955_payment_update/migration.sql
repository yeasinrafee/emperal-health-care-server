/*
  Warnings:

  - You are about to drop the column `paymentGatewayDAta` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentGatewayDAta",
ADD COLUMN     "paymentGatewayData" JSONB;
