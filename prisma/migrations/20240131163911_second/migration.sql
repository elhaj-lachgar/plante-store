/*
  Warnings:

  - You are about to drop the column `cardItemId` on the `order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cardId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cardId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_cardItemId_fkey`;

-- AlterTable
ALTER TABLE `carditem` ADD COLUMN `orderId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `cardItemId`,
    ADD COLUMN `cardId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_cardId_key` ON `Order`(`cardId`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
