/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Album` ADD COLUMN `pin` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `password`;
