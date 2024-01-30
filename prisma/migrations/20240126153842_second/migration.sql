/*
  Warnings:

  - Added the required column `updateAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `profile` VARCHAR(255) NULL,
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL;
